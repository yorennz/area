import 'package:flutter/material.dart';
import 'package:front_mobile/data/config.dart';
import 'package:front_mobile/pages/home.dart';
import 'pages/register/register_name.dart';
import 'pages/register/register_password.dart';
import 'pages/register/register_phone_number.dart';
import 'pages/register/register_email.dart';
import 'pages/login_page.dart';
import 'pages/welcome_page.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  await dotenv.load();
  AppConfig.hostIp = dotenv.env['HOSTIP'];
  AppConfig.port = dotenv.env['PORT'];
  AppConfig.url = dotenv.env['URL'];
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => WelcomePage(),
        '/login': (context) => LoginPage(),
        '/register-email': (context) => RegisterEmailPage(),
        '/register-name': (context) => RegisterNamePage(),
        '/register-phone-number': (context) => RegisterPhoneNumberPage(),
        '/register-password': (context) => RegisterPasswordPage(),
        '/home': (context) => HomePage(),
      },
    );
  }
}
