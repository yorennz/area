import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';

class RegisterEmailPage extends StatefulWidget {
  @override
  State<RegisterEmailPage> createState() => _RegisterEmailPageState();
}

class _RegisterEmailPageState extends State<RegisterEmailPage> {
  final SecureStorage secureStorage = SecureStorage();
  final emailController = TextEditingController();
  String email = '';
  bool error = false;

  @override
  void initState() {
    super.initState();

    emailController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  bool checkEmailFormat(String email) {
    return email.contains('@') && email.contains('.');
  }

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
                      height: 1,
                      width: 45,
                      radius: 4,
                      color: Color(0xff846b8a),
                    ),
                    Button(
                      height: 1,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pushNamed(context, '/register-name');
                      },
                    ),
                    Button(
                      height: 1,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pushNamed(context, '/register-phone-number');
                      },
                    ),
                    Button(
                      height: 1,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pushNamed(context, '/register-password');
                      },
                    ),
                  ]),
                  SizedBox(
                    height: 25,
                  ),
                  Text(
                    'What is your email adress ?',
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
                    onChanged: (value) =>
                        setState(() => email = emailController.text),
                    onSubmitted: (value) =>
                        setState(() => email = emailController.text),
                    width: 350,
                    height: 28,
                    hintText: 'exemple@gmail.com',
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.alternate_email_rounded),
                    suffixIcon: emailController.text.isEmpty
                        ? SizedBox(
                            width: 0,
                          )
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => emailController.clear(),
                          ),
                    controller: emailController,
                    unfocuseBorder: error ? Colors.red : Colors.black,
                    focusBorder: error ? Colors.red : Colors.black,
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
                              'Please provide a correct email.',
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
                    color: emailController.text.isNotEmpty
                        ? Color(0xff846b8a)
                        : Colors.grey.withOpacity(0.4),
                    onPressed: emailController.text.isNotEmpty
                        ? () async {
                            if (checkEmailFormat(emailController.text)) {
                              await secureStorage
                                  .storeData('email', email)
                                  .then((value) => Navigator.pushNamed(
                                      context, '/register-name'));
                            } else {
                              setState(() {
                                error = true;
                              });
                            }
                          }
                        : null,
                    child: Icon(
                      Icons.arrow_forward_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(
                    height: 25,
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
