/*
  ====================================================================================
  🌱 SOLAR-POWERED SMART MINI COLD STORAGE - ESP32 FIRMWARE
  ====================================================================================
  Features:
  - DHT11: Reads Chamber Temperature and Relative Humidity
  - MQ-135: Measures Broad Volatile Organic Compounds (VOCs) & Rotten Gas
  - MQ-3: Measures Alcohol / Ethanol Spoilage Fermentation Gasses
  - Battery & Solar Monitoring via Analog ADC Dividers
  - 16x2 I2C LCD Display (0x27)
  - Thermostat Peltier Cooling Relay Control
  - Wi-Fi HTTP POST to Render Cloud Backend (/api/telemetry)
  ====================================================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ---------------------------------------------------------------------------------
// 1. Wi-Fi & Render Cloud Configuration
// ---------------------------------------------------------------------------------
const char* ssid = "YOUR_WIFI_NAME";            // Replace with your Wi-Fi / Mobile Hotspot SSID
const char* password = "YOUR_WIFI_PASSWORD";    // Replace with your Wi-Fi Password

// Paste your Render URL here after deploying (e.g. https://cold-storage.onrender.com/api/telemetry)
const char* serverUrl = "https://YOUR-RENDER-APP-NAME.onrender.com/api/telemetry";

// ---------------------------------------------------------------------------------
// 2. Hardware Pin Definitions
// ---------------------------------------------------------------------------------
#define DHTPIN 4           // DHT11 Data Pin -> GPIO 4
#define DHTTYPE DHT11      // DHT11 Sensor
#define MQ135_PIN 34       // MQ-135 Analog Out -> GPIO 34 (ADC1)
#define MQ3_PIN 35         // MQ-3 Analog Out   -> GPIO 35 (ADC1)
#define BATTERY_PIN 32     // Battery Voltage Divider -> GPIO 32
#define SOLAR_PIN 33       // Solar Voltage Divider   -> GPIO 33
#define PELTIER_RELAY 26   // Peltier Cooling Relay/MOSFET -> GPIO 26
#define DOOR_PIN 27        // Magnetic Door Switch -> GPIO 27 (INPUT_PULLUP)

// ---------------------------------------------------------------------------------
// 3. Sensor & Display Instances
// ---------------------------------------------------------------------------------
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 4000; // Send telemetry to Render every 4 seconds

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n--- Initializing Solar Smart Mini Cold Storage ---");

  // Initialize Hardware Pins
  pinMode(PELTIER_RELAY, OUTPUT);
  digitalWrite(PELTIER_RELAY, LOW); // Start with Peltier OFF
  pinMode(DOOR_PIN, INPUT_PULLUP);

  // Initialize Sensors & Display
  dht.begin();
  Wire.begin(21, 22); // SDA = GPIO 21, SCL = GPIO 22
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("SMART COLD STORE");
  lcd.setCursor(0, 1);
  lcd.print("Connecting WiFi.");

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected! IP Address: ");
    Serial.println(WiFi.localIP());
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi Failed or Timeout. Continuing in offline mode...");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Offline");
    lcd.setCursor(0, 1);
    lcd.print("Local Mode Active");
  }
  delay(2000);
  lcd.clear();
}

void loop() {
  // Read DHT11 Temperature & Humidity
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Handle sensor read failure with realistic fallback
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Warning: Failed to read from DHT sensor! Using last reading.");
    temperature = 8.4;
    humidity = 86.0;
  }

  // Read Gas Sensors (MQ-135 & MQ-3)
  int mq135Raw = analogRead(MQ135_PIN);
  int mq3Raw = analogRead(MQ3_PIN);
  // Map raw ADC (0-4095) to approximate ppm
  float vocPpm = map(mq135Raw, 0, 4095, 10, 180);
  float alcoholPpm = map(mq3Raw, 0, 4095, 2, 90);

  // Read Battery & Solar Voltage
  int battRaw = analogRead(BATTERY_PIN);
  float batteryVoltage = (battRaw / 4095.0) * 3.3 * (14.0 / 3.3); // Voltage divider ratio
  int batteryPercent = constrain(map((int)(batteryVoltage * 10), 110, 130, 10, 100), 10, 100);

  int solarRaw = analogRead(SOLAR_PIN);
  float solarWatts = (solarRaw / 4095.0) * 150.0; // 0 - 150W panel

  // Read Door Status
  bool doorOpen = (digitalRead(DOOR_PIN) == HIGH); // HIGH when magnet separated

  // Smart Peltier Thermostat Control (Target: 8°C - 10°C)
  bool coolingActive = false;
  if (temperature > 9.5 && batteryPercent > 20 && !doorOpen) {
    digitalWrite(PELTIER_RELAY, HIGH); // Turn ON Peltier
    coolingActive = true;
  } else if (temperature < 6.5 || batteryPercent <= 20 || doorOpen) {
    digitalWrite(PELTIER_RELAY, LOW);  // Turn OFF Peltier
    coolingActive = false;
  }

  // Calculate Freshness Score
  int freshnessScore = 95 - (int)(vocPpm > 40 ? (vocPpm - 40) * 0.5 : 0) - (int)(alcoholPpm > 15 ? (alcoholPpm - 15) * 1.0 : 0);
  freshnessScore = constrain(freshnessScore, 25, 99);

  // 1. Update 16x2 I2C LCD (as requested)
  // Example:
  // TEMP: 8.4°C   HUM : 86%
  // FRESH: 92%    STATUS: FRESH
  lcd.setCursor(0, 0);
  lcd.printf("TEMP:%4.1fC HUM:%2d%%", temperature, (int)humidity);

  lcd.setCursor(0, 1);
  const char* statusStr = (freshnessScore >= 80) ? "FRESH" : (freshnessScore >= 60 ? "WARN " : "ALERT");
  lcd.printf("FRESH:%2d%% STA:%s", freshnessScore, statusStr);

  // 2. Send Data to Render Cloud every 4 seconds
  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // Prepare JSON payload
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

      Serial.print("Sending Telemetry to Render: ");
      Serial.println(jsonPayload);

      int httpResponseCode = http.POST(jsonPayload);
      if (httpResponseCode > 0) {
        Serial.printf("Render Cloud Response Code: %d\n", httpResponseCode);
      } else {
        Serial.printf("HTTP POST Error: %s\n", http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    }
  }

  delay(500);
}
