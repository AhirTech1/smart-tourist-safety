import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(SmartTouristApp());
}

class SmartTouristApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Tourist App',
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/home': (context) => HomeScreen(),
      },
    );
  }
}
