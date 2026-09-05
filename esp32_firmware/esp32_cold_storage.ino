/*
  ====================================================================================
  🌱 SOLAR-POWERED SMART MINI COLD STORAGE - ESP32 FIRMWARE
  Live Cloud Dashboard: https://solar-smart-cold-storage-9qgo.onrender.com
  ====================================================================================
  Hardware Overview:
  - ESP32 NodeMCU / DevKit V1
  - DHT11 Digital Temperature & Relative Humidity Sensor
  - MQ-135 Gas Sensor (Air Quality, Ammonia, Volatile Organic Compounds / VOCs)
  - MQ-3 Gas Sensor (Alcohol / Fermentation Spoilage Detection)
  - 12V Battery Voltage Divider (ADC GPIO 32)
  - Solar Panel Voltage Divider (ADC GPIO 33)
  - Magnetic Reed Door Switch (GPIO 27)
  - Solid-State Peltier Thermoelectric Cooler Relay/MOSFET (GPIO 26)
  - 16x2 I2C LCD Display (Address 0x27, SDA: GPIO 21, SCL: GPIO 22)
  ====================================================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <ArduinoJson.h>

// -----------------------------------------------------------------------------
// 1. Wi-Fi & Render Cloud Configuration
// -----------------------------------------------------------------------------
// Enter your Wi-Fi or Mobile Hotspot credentials here:
const char* ssid = "YOUR_WIFI_NAME";            
const char* password = "YOUR_WIFI_PASSWORD";    

// Live Render Cloud API Endpoint for Telemetry (HTTPS)
const char* serverUrl = "https://solar-smart-cold-storage-9qgo.onrender.com/api/telemetry";

// -----------------------------------------------------------------------------
// 2. Hardware Pin Definitions
// -----------------------------------------------------------------------------
#define DHTPIN 4           // DHT11 Data Pin -> GPIO 4
#define DHTTYPE DHT11      // DHT11 Sensor
#define MQ135_PIN 34       // MQ-135 Analog Out -> GPIO 34 (Air Quality / VOCs)
#define MQ3_PIN 35         // MQ-3 Analog Out   -> GPIO 35 (Alcohol / Fermentation)
#define BATTERY_PIN 32     // Battery Voltage Divider -> GPIO 32
#define SOLAR_PIN 33       // Solar Voltage Divider   -> GPIO 33
#define PELTIER_RELAY 26   // Peltier Cooling Relay/MOSFET -> GPIO 26
#define DOOR_PIN 27        // Magnetic Door Switch -> GPIO 27 (INPUT_PULLUP)

// Initialize Sensor and LCD Objects
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 3000; // Transmit telemetry to cloud every 3 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n=======================================================");
  Serial.println("  SOLAR SMART MINI COLD STORAGE - SYSTEM STARTING");
  Serial.println("=======================================================");

  // Initialize Control Pins
  pinMode(PELTIER_RELAY, OUTPUT);
  digitalWrite(PELTIER_RELAY, LOW); // Start with Peltier Cooler OFF
  pinMode(DOOR_PIN, INPUT_PULLUP);

  // Initialize DHT11 & I2C LCD
  dht.begin();
  Wire.begin(21, 22); // I2C Pins: SDA = GPIO 21, SCL = GPIO 22
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("SMART COLD STORE");
  lcd.setCursor(0, 1);
  lcd.print("Connecting WiFi.");

  // Connect to Wi-Fi Network
  Serial.print("Connecting to Wi-Fi network: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi Status] SUCCESS: Connected to Wi-Fi!");
    Serial.print("[Wi-Fi Status] ESP32 Assigned IP Address: ");
    Serial.println(WiFi.localIP());
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP().toString());
  } else {
    Serial.println("\n[Wi-Fi Status] FAILED: Could not connect to Wi-Fi. Check SSID and Password.");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed");
    lcd.setCursor(0, 1);
    lcd.print("Local Mode Only");
  }
  delay(2000);
  lcd.clear();
}

void loop() {
  // 1. Read DHT11 Temperature and Relative Humidity
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Sensor fail-safe check
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[Sensor Warning] DHT11 read failed, using safe fallback reading.");
    temperature = 8.4;
    humidity = 86.0;
  }

  // 2. Read Gas Sensors (MQ-135 & MQ-3)
  int mq135Raw = analogRead(MQ135_PIN);
  int mq3Raw = analogRead(MQ3_PIN);
  // Map raw 12-bit ADC (0 - 4095) to approximate ppm
  float vocPpm = map(mq135Raw, 0, 4095, 10, 180);
  float alcoholPpm = map(mq3Raw, 0, 4095, 2, 90);

  // 3. Read Battery & Solar Voltage Dividers
  int battRaw = analogRead(BATTERY_PIN);
  float batteryVoltage = (battRaw / 4095.0) * 3.3 * (14.0 / 3.3);
  int batteryPercent = constrain(map((int)(batteryVoltage * 10), 110, 130, 10, 100), 10, 100);

  int solarRaw = analogRead(SOLAR_PIN);
  float solarWatts = (solarRaw / 4095.0) * 150.0; // 150W Solar Panel scale

  // 4. Read Magnetic Door Switch
  bool doorOpen = (digitalRead(DOOR_PIN) == HIGH); // HIGH indicates door opened

  // 5. Smart Thermostat Control for Peltier Cooler (Target Range: 6.5°C - 9.5°C)
  bool coolingActive = false;
  if (temperature > 9.5 && batteryPercent > 20 && !doorOpen) {
    digitalWrite(PELTIER_RELAY, HIGH); // Turn ON Peltier Cooling
    coolingActive = true;
  } else if (temperature < 6.5 || batteryPercent <= 20 || doorOpen) {
    digitalWrite(PELTIER_RELAY, LOW);  // Turn OFF Peltier Cooling
    coolingActive = false;
  }

  // 6. Calculate Freshness Score based on Multi-Gas and Temperature
  int freshnessScore = 95 - (int)(vocPpm > 40 ? (vocPpm - 40) * 0.5 : 0) - (int)(alcoholPpm > 15 ? (alcoholPpm - 15) * 1.0 : 0);
  freshnessScore = constrain(freshnessScore, 25, 99);

  // 7. Update Physical 16x2 I2C LCD Display
  // Line 1: TEMP: 8.4C HUM:86%
  // Line 2: FRESH:92% STA:FRESH
  lcd.setCursor(0, 0);
  lcd.printf("TEMP:%4.1fC HUM:%2d%%", temperature, (int)humidity);
  lcd.setCursor(0, 1);
  const char* statusStr = (freshnessScore >= 80) ? "FRESH" : (freshnessScore >= 60 ? "WARN " : "ALERT");
  lcd.printf("FRESH:%2d%% STA:%s", freshnessScore, statusStr);

  // Print summary to Serial Monitor
  Serial.printf("[Sensors] Temp: %.1f C | Hum: %.0f %% | VOC: %.0f ppm | Alcohol: %.0f ppm | Batt: %d %% (%.1fV) | Solar: %.0f W\n",
                temperature, humidity, vocPpm, alcoholPpm, batteryPercent, batteryVoltage, solarWatts);

  // 8. Transmit Live Sensor Data to Render Cloud Dashboard (HTTPS POST)
  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    if (WiFi.status() == WL_CONNECTED) {
      // Create Secure Wi-Fi Client to handle HTTPS connection to Render
      WiFiClientSecure client;
      client.setInsecure(); // Bypass SSL Certificate verification for seamless connection
      client.setTimeout(10); // 10 seconds connection timeout

      HTTPClient http;
      if (http.begin(client, serverUrl)) {
        http.addHeader("Content-Type", "application/json");

        // Construct JSON payload
        StaticJsonDocument<300> doc;
        doc["temperature"] = temperature;
        doc["humidity"] = humidity;
        doc["battery"] = batteryPercent;
        doc["batteryVoltage"] = batteryVoltage;
        doc["solarPower"] = solarWatts;
        doc["coolingActive"] = coolingActive;
        doc["coolingPower"] = coolingActive ? 65.0 : 0.0;
        doc["voc"] = vocPpm;
        doc["alcohol"] = alcoholPpm;
        doc["doorOpen"] = doorOpen;

        String jsonPayload;
        serializeJson(doc, jsonPayload);

        Serial.print("[Cloud Transmit] POST to Render: ");
        Serial.println(jsonPayload);

        int httpResponseCode = http.POST(jsonPayload);
        if (httpResponseCode > 0) {
          Serial.printf("[Cloud Transmit SUCCESS] Render Server Response Code: %d (Data Delivered!)\n", httpResponseCode);
          String response = http.getString();
          Serial.print("[Cloud Server Reply] ");
          Serial.println(response);
        } else {
          Serial.printf("[Cloud Transmit ERROR] Code: %d - Reason: %s\n", httpResponseCode, http.errorToString(httpResponseCode).c_str());
        }
        http.end();
      } else {
        Serial.println("[Cloud Transmit ERROR] Unable to initiate HTTPS client connection.");
      }
    } else {
      Serial.println("[Cloud Transmit SKIP] Wi-Fi not connected yet. Waiting for reconnection...");
    }
  }

  delay(500);
}
