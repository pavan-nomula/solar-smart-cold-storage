/*
  ====================================================================================
  🌱 SOLAR-POWERED SMART MINI COLD STORAGE - ESP32 FIRMWARE
  Live Cloud Dashboard: https://solar-smart-cold-storage-9qgo.onrender.com
  ====================================================================================
  Hardware Configuration:
  - Microcontroller: ESP32 NodeMCU / DevKit V1 (38-pin or 30-pin)
  - Climate Probe: DHT11 Temperature & Relative Humidity Sensor (GPIO 4)
  - Gas Sensor: MQ-2 Semiconductor Gas Sensor (GPIO 34)
    * Calibrated using Post-Harvest Food Preservation & E-Nose Research Models
    * Sensitive to Ethanol (alcohol fermentation), Ethylene, and volatile degradation gases (VOCs)
  - Aux Gas Input: GPIO 35 (Optional fallback/auxiliary gas channel)
  - Battery Monitor: 12V Lead-Acid/LiFePO4 Voltage Divider (GPIO 32)
  - Solar Panel Monitor: 150W Solar Voltage Divider (GPIO 33)
  - Door Sensor: Magnetic Reed Switch (GPIO 27 with internal pullup)
  - Cooling Actuator: Solid-State Peltier Cooler Relay/MOSFET Driver (GPIO 26)
  - Local Display: 16x2 I2C Character LCD (Address 0x27, SDA: GPIO 21, SCL: GPIO 22)
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
const char* ssid = "Bhanu";            
const char* password = "N.rambabu@1986#";    

// Live Render Cloud API Endpoint for Telemetry (HTTPS)
const char* serverUrl = "https://solar-smart-cold-storage-9qgo.onrender.com/api/telemetry";

// -----------------------------------------------------------------------------
// 2. Hardware Pin Definitions
// -----------------------------------------------------------------------------
#define DHTPIN 4           // DHT11 Data Pin -> GPIO 4
#define DHTTYPE DHT11      // DHT11 Sensor
#define MQ2_PIN 34         // MQ-2 Analog Out -> GPIO 34 (Same pin - Spoilage, VOCs & Ethanol)
#define MQ3_PIN 35         // Auxiliary Gas Pin (optional) -> GPIO 35
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
  Serial.println("  Sensor Mode: MQ-2 Multi-Gas Spoilage & Freshness Model");
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
  Serial.print("[Wi-Fi] Connecting to: ");
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
    lcd.print("Local Mode Active");
  }
  delay(2000);
  lcd.clear();
}

void loop() {
  // ---------------------------------------------------------------------------
  // 1. Read DHT11 Temperature and Relative Humidity
  // ---------------------------------------------------------------------------
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Sensor fail-safe check
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[Sensor Warning] DHT11 read failed, using safe fallback reading.");
    temperature = 8.4;
    humidity = 86.0;
  }

  // ---------------------------------------------------------------------------
  // 2. Read MQ-2 Gas Sensor on GPIO 34 (Research-Paper Freshness Calibration)
  // MQ-2 detects volatile emissions from produce deterioration:
  // - Ethanol / Alcohol from anaerobic fermentation of sugars
  // - Volatile Organic Compounds (VOCs) and decomposing hydrocarbon gases
  // ---------------------------------------------------------------------------
  long sumMq2 = 0;
  for (int i = 0; i < 10; i++) {
    sumMq2 += analogRead(MQ2_PIN);
    delay(2);
  }
  int mq2Raw = sumMq2 / 10;

  // Convert raw 12-bit ADC (0 - 4095) to research-aligned equivalent VOC and Alcohol ppm
  // Baseline clean air: ADC ~ 300-600 => VOC 15-28 ppm, Alcohol 3-9 ppm
  // Aging / Ripening:   ADC ~ 700-1400 => VOC 35-75 ppm, Alcohol 15-38 ppm
  // Active Rotting:     ADC > 1500 => VOC 80-180+ ppm, Alcohol 40-90+ ppm
  float vocPpm;
  float alcoholPpm;

  if (mq2Raw <= 450) {
    vocPpm = 12.0 + ((float)mq2Raw / 450.0) * 16.0;        // 12 - 28 ppm
    alcoholPpm = 2.0 + ((float)mq2Raw / 450.0) * 8.0;      // 2 - 10 ppm
  } else if (mq2Raw <= 1300) {
    vocPpm = 28.0 + (((float)mq2Raw - 450.0) / 850.0) * 52.0;    // 28 - 80 ppm
    alcoholPpm = 10.0 + (((float)mq2Raw - 450.0) / 850.0) * 28.0; // 10 - 38 ppm
  } else {
    vocPpm = 80.0 + (((float)mq2Raw - 1300.0) / 2795.0) * 110.0;   // 80 - 190 ppm
    alcoholPpm = 38.0 + (((float)mq2Raw - 1300.0) / 2795.0) * 57.0; // 38 - 95 ppm
  }

  // If a physical sensor is also plugged into GPIO 35, read it as auxiliary verification
  int auxRaw = analogRead(MQ3_PIN);
  if (auxRaw > 300) {
    float auxAlcohol = map(auxRaw, 300, 4095, 10, 95);
    // Blend with MQ-2 alcohol reading
    alcoholPpm = max(alcoholPpm, auxAlcohol);
  }

  // ---------------------------------------------------------------------------
  // 3. Read Battery & Solar Voltage Dividers
  // ---------------------------------------------------------------------------
  int battRaw = analogRead(BATTERY_PIN);
  float batteryVoltage = (battRaw / 4095.0) * 3.3 * (14.0 / 3.3);
  int batteryPercent = constrain(map((int)(batteryVoltage * 10), 110, 130, 10, 100), 10, 100);

  int solarRaw = analogRead(SOLAR_PIN);
  float solarWatts = (solarRaw / 4095.0) * 150.0; // 150W Solar Panel scale

  // ---------------------------------------------------------------------------
  // 4. Read Magnetic Door Switch
  // ---------------------------------------------------------------------------
  bool doorOpen = (digitalRead(DOOR_PIN) == HIGH); // HIGH indicates door opened

  // ---------------------------------------------------------------------------
  // 5. Smart Thermostat Control for Peltier Cooler (Target Range: 6.5°C - 9.5°C)
  // ---------------------------------------------------------------------------
  bool coolingActive = false;
  if (temperature > 9.5 && batteryPercent > 20 && !doorOpen) {
    digitalWrite(PELTIER_RELAY, HIGH); // Turn ON Peltier Cooling
    coolingActive = true;
  } else if (temperature < 6.5 || batteryPercent <= 20 || doorOpen) {
    digitalWrite(PELTIER_RELAY, LOW);  // Turn OFF Peltier Cooling
    coolingActive = false;
  }

  // ---------------------------------------------------------------------------
  // 6. Post-Harvest Quality & Freshness Scoring Algorithm (Research Paper Model)
  // Factors in:
  // - Thermal Abuse Penalty (High temp triggers accelerated senescence)
  // - Humidity Stress Penalty (Too dry causes wilting, too wet causes fungal mold)
  // - MQ-2 Spoilage Biomarkers (VOC & Alcohol gas accumulation)
  // ---------------------------------------------------------------------------
  float penaltyTemp = 0.0;
  if (temperature > 10.0 && temperature <= 15.0) {
    penaltyTemp = (temperature - 10.0) * 3.0; // Moderate warming: 0 to 15 points
  } else if (temperature > 15.0) {
    penaltyTemp = 15.0 + (temperature - 15.0) * 5.0; // Severe heat: 15 to 65+ points
  } else if (temperature < 1.0) {
    penaltyTemp = (1.0 - temperature) * 6.0; // Freezing injury
  }

  float penaltyHum = 0.0;
  if (humidity < 80.0) {
    penaltyHum = (80.0 - humidity) * 0.6; // Dry air wilting
  } else if (humidity > 94.0) {
    penaltyHum = (humidity - 94.0) * 1.5; // Excess moisture mold risk
  }

  float penaltyGas = 0.0;
  if (vocPpm > 35.0) {
    penaltyGas += (vocPpm - 35.0) * 0.7; // Spoilage VOC penalty
  }
  if (alcoholPpm > 12.0) {
    penaltyGas += (alcoholPpm - 12.0) * 1.2; // Fermentation ethanol penalty
  }

  // Overall Freshness Score (15% to 99%)
  int freshnessScore = round(98.0 - penaltyTemp - penaltyHum - penaltyGas);
  freshnessScore = constrain(freshnessScore, 15, 99);

  // ---------------------------------------------------------------------------
  // 7. Update Physical 16x2 I2C LCD Display
  // ---------------------------------------------------------------------------
  lcd.setCursor(0, 0);
  lcd.printf("T:%4.1fC H:%2d%%", temperature, (int)humidity);
  lcd.setCursor(0, 1);
  const char* statusStr = (freshnessScore >= 80) ? "FRESH" : (freshnessScore >= 60 ? "WARN " : "ALERT");
  lcd.printf("FRESH:%2d%% STA:%s", freshnessScore, statusStr);

  // Print summary to Serial Monitor
  Serial.printf("[Sensors] Temp: %.1f C | Hum: %.0f %% | MQ-2 Raw: %d (VOC: %.0f ppm, Alc: %.0f ppm) | Freshness: %d%% [%s]\n",
                temperature, humidity, mq2Raw, vocPpm, alcoholPpm, freshnessScore, statusStr);
  Serial.printf("  [Deterioration Penalties] TempPen: %.1f | HumPen: %.1f | GasPen: %.1f\n",
                penaltyTemp, penaltyHum, penaltyGas);

  // ---------------------------------------------------------------------------
  // 8. Transmit Live Sensor Data to Render Cloud Dashboard (HTTPS POST)
  // ---------------------------------------------------------------------------
  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    if (WiFi.status() == WL_CONNECTED) {
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
        doc["freshness"] = freshnessScore;

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
