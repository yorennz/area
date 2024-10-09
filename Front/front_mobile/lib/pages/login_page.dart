import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
// import 'package:front_mobile/pages/home.dart';

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final SecureStorage secureStorage = SecureStorage();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  String email = '';
  String password = '';
  bool isPasswordVisible = false;
  bool? isChecked = false;
  int? statusCode;
  bool inputValueEmpty = false;
  bool error = false;

  // 8 caractere, 1 lettre, 1  chiffre, 1 caractere special, 1 majuscule
  @override
  void initState() {
    super.initState();
    emailController.addListener(() => setState(() {}));
    passwordController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  bool inputController(String email, String password) {
    if (email.isEmpty || password.isEmpty) {
      return true;
    } else {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: GradientBackground(
            child: SingleChildScrollView(
      child: Stack(
        children: [
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
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'Sign In',
                        style: TextStyle(
                          fontSize: 55,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(
                        child: error
                            ? Center(
                                child: SizedBox(
                                    child: Column(children: [
                                SizedBox(
                                  height: 30,
                                ),
                                Text(
                                  'Please provide a correct email and password.',
                                  style: TextStyle(
                                      fontSize: 15,
                                      color: Colors.red,
                                      fontWeight: FontWeight.bold),
                                ),
                                SizedBox(
                                  height: 20,
                                )
                              ])))
                            : SizedBox(
                                height: 50,
                              ),
                      ),
                      TextInput(
                        backgroundColor: Colors.white.withOpacity(0.5),
                        onChanged: (value) {
                          setState(() {
                            email = emailController.text;
                          });
                        },
                        onSubmitted: (value) {
                          setState(() {
                            email = emailController.text;
                          });
                        },
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
                        focusBorder: error ? Colors.red : Colors.black,
                        unfocuseBorder: error ? Colors.red : Colors.black,
                        controller: emailController,
                      ),
                      SizedBox(
                        height: 30,
                      ),
                      TextInput(
                          backgroundColor: Colors.white.withOpacity(0.5),
                          controller: passwordController,
                          onChanged: (value) => setState(
                              () => password = passwordController.text),
                          onSubmitted: (value) => setState(
                              () => password = passwordController.text),
                          width: 350,
                          height: 28,
                          hintText: '*********',
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
                          unfocuseBorder: error ? Colors.red : Colors.black,
                          focusBorder: error ? Colors.red : Colors.black),
                      SizedBox(
                        height: 10,
                      ),
                      GestureDetector(
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: Text(
                            'Forget password ?',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.blue,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        onTap: () {},
                      ),
                      CheckboxListTile(
                        value: isChecked,
                        controlAffinity: ListTileControlAffinity.leading,
                        activeColor: Colors.black,
                        onChanged: (bool? value) {
                          setState(() {
                            isChecked = value;
                          });
                        },
                        title: Text(
                          "Stay sign in",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        contentPadding: EdgeInsets.fromLTRB(0, 0, 0, 0),
                      ),
                      SizedBox(
                        height: 150,
                      ),
                      Button(
                        height: 70,
                        width: 70,
                        radius: 10,
                        color: (!inputController(email, password))
                            ? Color.fromRGBO(132, 107, 138, 1)
                            : Colors.grey.withOpacity(0.4),
                        onPressed: (!inputController(email, password))
                            ? () async {
                                loginUser(email, password).then((statusCode) {
                                  if (statusCode == 200) {
                                    secureStorage.storeData('isLogged', 'True');
                                    Navigator.pushNamed(context, '/home');
                                  } else {
                                    setState(() {
                                      error = true;
                                    });
                                  }
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
                        height: 30,
                      ),
                      Text(
                        "CAN'T SIGN IN",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      GestureDetector(
                        child: Text(
                          'CREATE AN ACCOUNT',
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        onTap: () {
                          Navigator.pushNamed(context, '/register-email');
                        },
                      ),
                    ],
                  ),
                )),
          ),
        ],
      ),
    )));
  }
}
