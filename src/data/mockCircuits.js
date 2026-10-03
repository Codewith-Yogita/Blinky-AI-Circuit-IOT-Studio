export const waterLevelAlarmCircuit = {
  id: "water_level_alarm",
  title: "Water Level / Distance Alarm with Buzzer",
  board: {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  },
  components: [
    {
      id: "ultrasonic_1",
      type: "ultrasonic",
      name: "HC-SR04 Ultrasonic",
    },
    {
      id: "buzzer_1",
      type: "buzzer",
      name: "Piezo Buzzer Alarm",
    },
    {
      id: "resistor_1",
      type: "resistor",
      name: "220Ω Resistor",
    },
    {
      id: "led_1",
      type: "led",
      name: "Red Alert LED",
    },
  ],
  connections: [
    {
      from: { component: "esp32", pin: "5V" },
      to: { component: "ultrasonic_1", pin: "VCC" },
    },
    {
      from: { component: "esp32", pin: "GND" },
      to: { component: "ultrasonic_1", pin: "GND" },
    },
    {
      from: { component: "esp32", pin: "GPIO5" },
      to: { component: "ultrasonic_1", pin: "TRIG" },
    },
    {
      from: { component: "esp32", pin: "GPIO18" },
      to: { component: "ultrasonic_1", pin: "ECHO" },
    },
    {
      from: { component: "esp32", pin: "GPIO16" },
      to: { component: "buzzer_1", pin: "+" },
    },
    {
      from: { component: "buzzer_1", pin: "-" },
      to: { component: "esp32", pin: "GND" },
    },
    {
      from: { component: "esp32", pin: "GPIO2" },
      to: { component: "resistor_1", pin: "1" },
    },
    {
      from: { component: "resistor_1", pin: "2" },
      to: { component: "led_1", pin: "anode" },
    },
    {
      from: { component: "led_1", pin: "cathode" },
      to: { component: "esp32", pin: "GND" },
    },
  ],
  code: `// Blinky generated Arduino C++ sketch for ESP32
// Project: Water Level & Obstacle Distance Alarm
// Module: ESP32 Hardware Firmware

#define TRIG_PIN 5
#define ECHO_PIN 18
#define BUZZER_PIN 16
#define LED_PIN 2

const int THRESHOLD_CM = 15; // Alarm distance threshold

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  Serial.println("⚡ Blinky: Water Level & Distance Alarm Online");
}

void loop() {
  // Trigger ultrasonic sound pulse (10 microseconds)
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Measure echo duration
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.034 / 2;

  // Output live telemetry to Serial (TigerData sync)
  Serial.print("DISTANCE_CM:");
  Serial.print(distanceCm);
  Serial.print(",LED:");
  Serial.println(distanceCm < THRESHOLD_CM ? "ON" : "OFF");

  // Trigger alarm if level/distance is below threshold (< 15 cm)
  if (distanceCm > 0 && distanceCm < THRESHOLD_CM) {
    digitalWrite(BUZZER_PIN, HIGH); // Alarm Active
    digitalWrite(LED_PIN, HIGH);    // Visual Warning ON
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
  }

  delay(200);
}`,
  instructions: [
    "1. Place your ESP32 DevKit V1 and HC-SR04 ultrasonic sensor onto the breadboard.",
    "2. Connect sensor VCC to ESP32 5V (VIN) and sensor GND to ESP32 GND.",
    "3. Connect sensor TRIG to ESP32 GPIO5 and ECHO to ESP32 GPIO18.",
    "4. Connect the Piezo Buzzer positive (+) lead to GPIO16 and negative (-) to GND.",
    "5. Connect the 220Ω resistor from GPIO2 to the LED anode A (+), and connect LED cathode K (-) to GND.",
    "6. Click 'Flash to ESP32' or speak 'Flash it' to upload firmware and start live telemetry.",
  ],
};

export const singleLedCircuit = {
  id: "single_led_blink",
  title: "ESP32 Hardware Circuit Diagram",
  board: {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  },
  components: [
    {
      id: "resistor_1",
      type: "resistor",
      name: "220Ω Resistor",
    },
    {
      id: "led_1",
      type: "LED",
      name: "Red LED",
    },
  ],
  connections: [
    {
      from: { component: "esp32", pin: "GPIO2" },
      to: { component: "resistor_1", pin: "1" },
    },
    {
      from: { component: "resistor_1", pin: "2" },
      to: { component: "led_1", pin: "anode" },
    },
    {
      from: { component: "led_1", pin: "cathode" },
      to: { component: "esp32", pin: "GND" },
    },
  ],
  instructions: [
    "1. Place the ESP32 DevKit V1 onto the center of your breadboard.",
    "2. Place the 220Ω current-limiting resistor into the breadboard.",
    "3. Route a jumper wire from ESP32 pin GPIO2 to Pin 1 of the 220Ω resistor.",
    "4. Insert the Red LED (longer lead is Anode +, shorter lead is Cathode -).",
    "5. Route a jumper wire from Pin 2 of the resistor to the LED Anode (+).",
    "6. Route a jumper wire from the LED Cathode (-) to the ESP32 GND pin to complete the circuit.",
    "7. Power on the ESP32 and run the live hardware simulation!",
  ],
  code: `// Blinky generated Arduino C++ sketch for ESP32
// Target Board: ESP32 DevKit V1
// Circuit: LED on GPIO2 with 220Ω current-limiting resistor

#define LED_PIN 2

void setup() {
  // Initialize GPIO2 as digital output
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("⚡ Blinky: ESP32 LED Blink initialized on GPIO2");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);   // Turn LED ON
  delay(1000);                   // Wait 1000ms (1 second)
  digitalWrite(LED_PIN, LOW);    // Turn LED OFF
  delay(1000);                   // Wait 1000ms (1 second)
}`,
};

export const dualLedButtonCircuit = {
  board: {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  },
  components: [
    {
      id: "resistor_1",
      type: "resistor",
      name: "220Ω Resistor (LED 1)",
    },
    {
      id: "led_1",
      type: "LED",
      name: "Status LED",
    },
    {
      id: "button_1",
      type: "button",
      name: "Tactile Push Button",
    },
  ],
  connections: [
    {
      from: { component: "esp32", pin: "GPIO2" },
      to: { component: "resistor_1", pin: "1" },
    },
    {
      from: { component: "resistor_1", pin: "2" },
      to: { component: "led_1", pin: "anode" },
    },
    {
      from: { component: "led_1", pin: "cathode" },
      to: { component: "esp32", pin: "GND" },
    },
    {
      from: { component: "esp32", pin: "GPIO4" },
      to: { component: "button_1", pin: "1" },
    },
    {
      from: { component: "button_1", pin: "2" },
      to: { component: "esp32", pin: "GND" },
    },
  ],
  code: `// Blinky generated Arduino C++ sketch for ESP32
// Target Board: ESP32 DevKit V1
// Circuit: Button on GPIO4, Status LED on GPIO2

#define BUTTON_PIN 4
#define LED_PIN 2

void setup() {
  // Use internal pull-up resistor for button
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);

  Serial.begin(115200);
  Serial.println("⚡ Blinky: Interactive Button Controller Ready");
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  // With INPUT_PULLUP, pressing the button pulls the line to LOW
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);  // Light up when pressed
  } else {
    digitalWrite(LED_PIN, LOW);   // Keep off when released
  }
  
  delay(20); // Small debounce delay
}`,
};

export const joystickLedCircuit = {
  id: "joystick_led_alarm",
  title: "Dual-Axis Joystick with Red Alert LED",
  board: {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  },
  components: [
    {
      id: "joystick_1",
      type: "joystick",
      name: "Analog Joystick Module",
    },
    {
      id: "resistor_1",
      type: "resistor",
      name: "220Ω Resistor",
    },
    {
      id: "led_1",
      type: "LED",
      color: "red",
      name: "Red Alert LED",
    },
  ],
  connections: [
    {
      from: { component: "esp32", pin: "5V" },
      to: { component: "joystick_1", pin: "VCC" },
    },
    {
      from: { component: "esp32", pin: "GND" },
      to: { component: "joystick_1", pin: "GND" },
    },
    {
      from: { component: "esp32", pin: "GPIO34" },
      to: { component: "joystick_1", pin: "VERT" },
    },
    {
      from: { component: "esp32", pin: "GPIO35" },
      to: { component: "joystick_1", pin: "HORZ" },
    },
    {
      from: { component: "esp32", pin: "GPIO4" },
      to: { component: "joystick_1", pin: "SEL" },
    },
    {
      from: { component: "esp32", pin: "GPIO2" },
      to: { component: "resistor_1", pin: "1" },
    },
    {
      from: { component: "resistor_1", pin: "2" },
      to: { component: "led_1", pin: "anode" },
    },
    {
      from: { component: "led_1", pin: "cathode" },
      to: { component: "esp32", pin: "GND" },
    },
  ],
  code: `// Blinky generated Arduino C++ sketch for ESP32
// Project: Dual-Axis Analog Joystick with Red Alert LED
// Module: ESP32 Hardware Firmware

#define JOYSTICK_VERT_PIN 34 // ADC1_CH6 (Y-axis analog)
#define JOYSTICK_HORZ_PIN 35 // ADC1_CH7 (X-axis analog)
#define JOYSTICK_SEL_PIN  4  // Digital pushbutton (Select)
#define RED_LED_PIN       2  // Red alert LED on GPIO2

const int THRESHOLD_LOW  = 1200; // Joystick moved left/down
const int THRESHOLD_HIGH = 2800; // Joystick moved right/up

void setup() {
  Serial.begin(115200);
  
  // Configure Analog & Digital Inputs
  pinMode(JOYSTICK_SEL_PIN, INPUT_PULLUP);
  pinMode(RED_LED_PIN, OUTPUT);
  
  Serial.println("⚡ Blinky: Dual-Axis Joystick Controller Online");
}

void loop() {
  int yVal = analogRead(JOYSTICK_VERT_PIN);
  int xVal = analogRead(JOYSTICK_HORZ_PIN);
  bool btnPressed = (digitalRead(JOYSTICK_SEL_PIN) == LOW);

  // Trigger Red Alert LED if joystick deflected outside deadzone or button pressed
  bool isAlert = (xVal < THRESHOLD_LOW || xVal > THRESHOLD_HIGH || 
                  yVal < THRESHOLD_LOW || yVal > THRESHOLD_HIGH || 
                  btnPressed);

  if (isAlert) {
    digitalWrite(RED_LED_PIN, HIGH); // Red Alert Active
  } else {
    digitalWrite(RED_LED_PIN, LOW);  // Standby
  }

  // Stream live telemetry
  Serial.print("JOY_X:");
  Serial.print(xVal);
  Serial.print(",JOY_Y:");
  Serial.print(yVal);
  Serial.print(",BTN:");
  Serial.print(btnPressed ? "PRESSED" : "IDLE");
  Serial.print(",RED_LED:");
  Serial.println(isAlert ? "ON" : "OFF");

  delay(50);
}`,
  instructions: [
    "1. Mount the ESP32 DevKit V1 and Dual-Axis Analog Joystick Module on your breadboard.",
    "2. Connect Joystick VCC to ESP32 5V.",
    "3. Connect Joystick GND to ESP32 GND (left header pin GND.2).",
    "4. Connect Joystick VERT (Y-Axis) to ESP32 GPIO34 (ADC1 channel).",
    "5. Connect Joystick HORZ (X-Axis) to ESP32 GPIO35 (ADC1 channel).",
    "6. Connect Joystick SEL (pushbutton) to ESP32 GPIO4 (configured as INPUT_PULLUP).",
    "7. Connect ESP32 GPIO2 to one leg of the 220Ω current-limiting resistor.",
    "8. Connect the resistor's other leg to the Red LED Anode (+ longer leg).",
    "9. Connect the Red LED Cathode (- shorter leg) to ESP32 right GND pin.",
    "10. Deflecting the joystick or clicking the thumbstick will trigger the Red Alert LED!",
  ],
};

export const oledDisplayCircuit = {
  id: "oled_display",
  title: "ESP32 SSD1306 0.96\" I2C OLED Display",
  board: {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  },
  components: [
    {
      id: "oled_1",
      type: "oled",
      name: "SSD1306 0.96\" I2C OLED",
    },
  ],
  connections: [
    {
      from: { component: "esp32", pin: "3V3" },
      to: { component: "oled_1", pin: "VCC" },
    },
    {
      from: { component: "esp32", pin: "GND" },
      to: { component: "oled_1", pin: "GND" },
    },
    {
      from: { component: "esp32", pin: "GPIO22" },
      to: { component: "oled_1", pin: "SCL" },
    },
    {
      from: { component: "esp32", pin: "GPIO21" },
      to: { component: "oled_1", pin: "SDA" },
    },
  ],
  code: `// Blinky generated Arduino C++ sketch for ESP32
// Project: ESP32 SSD1306 OLED Display "hello Blinky!"
// Protocol: I2C (SDA=21, SCL=22)

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(14, 20);
  display.println("hello");
  display.setCursor(14, 38);
  display.println("Blinky!");
  display.display();

  Serial.println("⚡ Blinky: OLED Display Initialized Successfully");
}

void loop() {
  // Pulse screen brightness or update status message
  delay(1000);
}`,
  instructions: [
    "1. Mount the ESP32 DevKit V1 and 0.96\" I2C OLED Display onto the breadboard.",
    "2. Connect OLED VCC to ESP32 3V3 power output.",
    "3. Connect OLED GND to ESP32 GND rail.",
    "4. Connect OLED SCL pin to ESP32 GPIO22 (I2C Clock).",
    "5. Connect OLED SDA pin to ESP32 GPIO21 (I2C Data).",
    "6. Upload firmware to see 'hello Blinky!' shine on the high-contrast display!",
  ],
};

