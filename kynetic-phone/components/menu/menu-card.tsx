import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const { width } = Dimensions.get("window");

function parseNumber(value: string) {
  return parseFloat(value.replace(/[^\d.-]/g, ""));
}

function getWeatherIcon(data: any) {
  const temp = parseNumber(data.temperature);
  const wind = parseNumber(data.windSpeed);
  const clouds = parseNumber(data.cloudCover);
  const rain = parseNumber(data.rain ?? "0");

  if (rain > 0) return "rain";
  if (wind > 30) return "wind";
  if (clouds > 70) return "cloudy";
  if (clouds > 30) return "partly-cloudy";
  if (temp <= 0) return "cold";
  return "clear";
}

function getClubSymbol(clubLogo: any, clubName: string) {
  if (clubLogo != null) return clubLogo;
  if (clubName.length <= 10) return clubName;
  
  const cleanName = clubName.replace(/[^a-zA-Z\s]/g, "");

  return cleanName
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("");   

}

const WEATHER_ICONS: Record<string, any> = {
  clear: require("@/assets/weather/clear.png"),
  "partly-cloudy": require("@/assets/weather/partly-cloudy.png"),
  cloudy: require("@/assets/weather/cloudy.png"),
  rain: require("@/assets/weather/rain.png"),
  wind: require("@/assets/weather/wind.png"),
  cold: require("@/assets/weather/cold.png"),
};

const SPORT_ICONS: Record<string, any> = {
  golf: require("@/assets/images/avatar/golf.png"),
  tennis: require("@/assets/images/avatar/tennis.png"),
};

export default function MenuCard({ data }: any) {
  const weatherKey = getWeatherIcon(data);
  const weatherIcon = WEATHER_ICONS[weatherKey];

  const golfIcon = SPORT_ICONS[data.sportName?.toLowerCase()]

  return (
    <View style={styles.card}>
      {/* Club */}
      <View style={[styles.section, styles.clubSection]}>
        <Text style={styles.clubText}>{getClubSymbol(data.clubLogo, data.clubName)}</Text>
      </View>

      {/* Sport Specific */}
      <View style={styles.section}>
        <Image source={golfIcon} style={styles.weatherIcon} />
      </View>

      {/* Weather */}
      <View style={styles.section}>
        <Image source={weatherIcon} style={styles.weatherIcon} />
        <Text style={styles.tempText}>{data.temperature}</Text>
      </View>

      {/* Metrics */}
      <View style={[styles.section, styles.metricsSection]}>
        <Text style={styles.metric}>💧 {data.humidity}</Text>
        <Text style={styles.metric}>☁ {data.cloudCover}</Text>
        <Text style={styles.metric}>🌬 {data.windSpeed}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: width - 32,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  clubSection: {
    flex: 0.8,
    alignItems: "flex-start",
    // paddingRight: 8,
  },
  metricsSection: {
    borderRightWidth: 0,
  },
  clubText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  weatherIcon: {
    width: 36,
    height: 36,
    marginBottom: 4,
  },
  tempText: {
    fontSize: 14,
    fontWeight: "600",
  },
  metric: {
    fontSize: 12,
    color: "#666",
  },
});

