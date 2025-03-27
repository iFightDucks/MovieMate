# MovieMate

A beautiful React Native movie discovery application built with Expo.

## Features

- **Movie Discovery**: Browse trending and popular movies
- **Search Functionality**: Find movies by title, actor, or director
- **Movie Details**: View comprehensive information about each movie
- **Favorites/Bookmarks**: Save your favorite movies for later viewing
- **Dark Theme UI**: Sleek dark-themed interface for comfortable viewing

## Screenshots

*(Screenshots would be included here)*

## Technologies

- React Native with Expo
- React Navigation
- React Query for data fetching
- OMDb API for movie data
- AsyncStorage for persistent data
- Custom hooks for state management

## Installation

### Prerequisites

- Node.js and npm installed
- Expo CLI: `npm install -g expo-cli`

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MovieMate.git
cd MovieMate
```

2. Install dependencies:
```bash
cd MovieMateExpo
npm install
```

3. Start the development server:
```bash
npm start
# or
npx expo start
```

4. Run on mobile device or emulator:
   - Scan the QR code with the Expo Go app (Android) or the Camera app (iOS)
   - Press 'a' for Android emulator or 'i' for iOS simulator (if installed)

## Project Structure

```
MovieMateExpo/
├── app/                  # App screens and navigation
│   ├── (tabs)/           # Tab-based navigation screens
│   └── movie/            # Movie details screen
├── assets/               # Images, fonts, and other static resources
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
└── constants/            # App constants and theme configuration
```

## API Usage

This project uses the OMDb API to fetch movie data. You'll need to:

1. Get an API key from [OMDb API](https://www.omdbapi.com/apikey.aspx)
2. The API key is already integrated in the app code, but you can replace it with your own if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- User authentication and profiles
- Advanced filtering and sorting options
- Offline support
- Movie recommendations based on viewing history
- Integration with additional movie data sources

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OMDb API](https://www.omdbapi.com/) for providing movie data
- [Expo](https://expo.dev/) for the amazing React Native toolchain
- [React Navigation](https://reactnavigation.org/) for the navigation system 
