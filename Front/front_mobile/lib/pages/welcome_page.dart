import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  final SecureStorage secureStorage = SecureStorage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: GradientBackground(
            child: SingleChildScrollView(
      child: Stack(
        children: [
          GradientBackground(),
          Center(
            child: Column(
              children: [
                SizedBox(
                  height: 500,
                  child: Image.asset('assets/Logo/logo_nobg.png'),
                ),
                Text(
                  'Welcome to Area',
                  style: TextStyle(
                    fontSize: 42,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 50),
                Button(
                    height: 75,
                    width: 190,
                    radius: 20,
                    color: Color(0xff846b8a),
                    onPressed: () {
                      Navigator.pushNamed(context, '/login');
                    },
                    child: Text("SIGN IN",
                        style: TextStyle(
                          fontSize: 25,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ))),
                SizedBox(height: 50),
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Button(
                    height: 45,
                    width: 100,
                    radius: 10,
                    color: Color(0xff0079fb),
                    onPressed: () {},
                    child: Image.asset(
                      'assets/Logo/Facebook-logo.png',
                      height: 30,
                    ),
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Button(
                    height: 45,
                    width: 100,
                    radius: 10,
                    color: Colors.white,
                    onPressed: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => LoginGoogle()),
                      );
                    },
                    child: Image.asset(
                      'assets/Logo/Google-logo.png',
                      height: 30,
                    ),
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Button(
                    height: 45,
                    width: 100,
                    radius: 10,
                    color: Color(0xff5665ec),
                    onPressed: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => LoginDiscord()),
                      );
                    },
                    child: Image.asset(
                      'assets/Logo/Discord-logo.png',
                      height: 30,
                    ),
                  ),
                ]),
              ],
            ),
          )
        ],
      ),
    )));
  }
}
