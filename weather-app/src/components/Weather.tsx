import React, { useState } from "react";
import {
  Container,
  Form,
  Spinner,
  Button,
  Alert,
  Card,
  CardTitle,
  CardText,
  CardBody,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
}

function Weatherdata() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showCard, setShowCard] = useState(false);

  const apiKey = `9ac4c545d4735778823296290794c46d`;

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Hatası: ", errorData);
        throw new Error("Hava durumu alınırken hata oluştu");
      }
      const data: WeatherData = await response.json();
      console.log(data);
      setWeather(data);
      setShowCard(true); // Hava durumu verisi alındıktan sonra kartı göster
    } catch (error) {
      console.error("Hata: ", error);
      setError("Hava durumu bilgileri alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  const getBackgroundImage = () => {
    if (!weather) return "default.jpeg";
    const condition = weather.weather[0].main.toLowerCase();

    switch (condition) {
      case "clear":
        return "sunnyday.jpg";
      case "rain":
        return "rainyday.jpg";
      case "clouds":
        return "cloud.jpg";
      default:
        return "default.jpeg";
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCard(false); // Yeni şehir arandığında kartı gizle
    fetchWeather();
  };

  return (
    <div
      className="pt-5 weather-app"
      style={{
        backgroundImage: `url(../src/assets/${getBackgroundImage()})`,
      }}
    >
      <Container>
        <h1>Weather App</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Şehir adını giriniz..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button variant="warning" type="submit" className="ms-2">
            {loading ? <Spinner animation="border" size="sm" /> : "Ara"}
          </Button>
        </Form>
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {weather && (
          <Card className={`card ${showCard ? "show" : ""}`}>
            <CardTitle>{weather.name}</CardTitle>
            <CardText>{weather.weather[0].description}</CardText>
            <CardBody>
              <CardText>Sıcaklık: {Math.round(weather.main.temp)} °C</CardText>
              <CardText>Nem: {Math.round(weather.main.humidity)} %</CardText>
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default Weatherdata;
