// Example for OperWeatherMap response (simplified)
export interface WeatherData {
    name: string; //City name
    main: {
        temp:number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}