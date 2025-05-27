const patternDict = [
    {
        pattern: '\\b(?<greeting>Hi|Hello|Hey)\\b',
        intent: 'Hello' 
    },
    {
        pattern: '\\b(bye|exit)\\b',
        intent: 'Exit'
    },
    {
        pattern: 'like\\sin\\s\\b(?<city>.+)',
        intent: 'CurrentWeather'
    },
    {
        pattern: '(?<weather>rain|rainy|sunny|cloudy|snow|thunderstorms|windy|drizzle)\\s+(?<time>day\\safter\\stomorrow|tomorrow|today)\\s+in\\s+(?<city>[a-zA-Z ]+)[?]?$',
        intent: 'WeatherForecast'
    },
    {
        pattern: '(?<weather>rain|rainy|sunny|cloudy|snow|thunderstorms|windy|drizzle)\\s+in\\s+(?<city>[a-zA-Z ]+)\\s+(?<time>day\\safter\\stomorrow|tomorrow|today)[?]?$',
        intent: 'WeatherForecast'
    }
];

module.exports = patternDict