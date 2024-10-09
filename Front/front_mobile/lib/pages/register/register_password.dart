import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';

class RegisterPasswordPage extends StatefulWidget {
  @override
  State<RegisterPasswordPage> createState() => _RegisterPasswordPageState();
}

class _RegisterPasswordPageState extends State<RegisterPasswordPage> {
  final SecureStorage secureStorage = SecureStorage();
  String password = '';
  bool isPasswordVisible = false;
  bool error = false;
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: GradientBackground(
            child: SingleChildScrollView(
                child: Stack(children: [
      ReturnButton(),
      Center(
          child: SizedBox(
              height: 850,
              width: 350,
              child: Center(
                  child: Column(
                children: [
                  SizedBox(
                    height: 100,
                  ),
                  Text(
                    'Area',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(
                    height: 15,
                  ),
                  Text(
                    'Create an account',
                    style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Button(
                      height: 10,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-email');
                      },
                    ),
                    Button(
                      height: 10,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-name');
                      },
                    ),
                    Button(
                      height: 10,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-phone-number');
                      },
                    ),
                    Button(
                      height: 10,
                      width: 45,
                      radius: 4,
                      color: Color(0xff846b8a),
                    ),
                  ]),
                  SizedBox(
                    height: 25,
                  ),
                  Text(
                    'What is your password ?',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  TextInput(
                    backgroundColor: Colors.white.withOpacity(0.5),
                    onChanged: (value) => setState(() => password = value),
                    onSubmitted: (value) =>
                        (value) => setState(() => password = value),
                    width: 350,
                    height: 28,
                    hintText: '********',
                    labelText: 'Password',
                    prefixIcon: Icon(Icons.lock_outline_rounded),
                    suffixIcon: IconButton(
                      icon: isPasswordVisible
                          ? Icon(Icons.visibility_off_outlined)
                          : Icon(Icons.visibility_outlined),
                      onPressed: () => setState(
                          () => isPasswordVisible = !isPasswordVisible),
                    ),
                    obscureText: !isPasswordVisible,
                  ),
                  SizedBox(
                    child: error
                        ? Center(
                            child: SizedBox(
                                child: Column(children: [
                            SizedBox(
                              height: 15,
                            ),
                            Text(
                              errorMessage,
                              style: TextStyle(
                                  fontSize: 15,
                                  color: Colors.red,
                                  fontWeight: FontWeight.bold),
                            ),
                            SizedBox(
                              height: 240,
                            )
                          ])))
                        : SizedBox(
                            height: 270,
                          ),
                  ),
                  Button(
                    height: 70,
                    width: 70,
                    radius: 10,
                    color: password.isNotEmpty
                        ? Color(0xff846b8a)
                        : Colors.grey.withOpacity(0.4),
                    onPressed: password.isNotEmpty
                        ? () async {
                            await secureStorage.storeData('password', password);
                            registerUser(
                                    await secureStorage.readData('email'),
                                    await secureStorage.readData('password'),
                                    await secureStorage.readData('lastname'),
                                    await secureStorage.readData('firstname'),
                                    await secureStorage.readData('phonenumber'))
                                .then((statusCode) {
                              if (statusCode == 201) {
                                Navigator.pushNamed(context, '/home');
                              }
                              if (statusCode == 400) {
                                setState(() {
                                  errorMessage =
                                      'An field is incorrect or missing, try Again';
                                });
                              }
                              if (statusCode == 409) {
                                setState(() {
                                  errorMessage = 'Email already registered';
                                });
                              }
                              setState(() {
                                error = true;
                              });
                            });
                          }
                        : null,
                    child: Icon(
                      Icons.arrow_forward_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(
                    height: 40,
                  ),
                  GestureDetector(
                    child: Text(
                      'Already have an account ?',
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    onTap: () {
                      Navigator.pushNamed(context, '/login');
                    },
                  ),
                ],
              ))))
    ]))));
  }
}
