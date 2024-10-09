import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';

class RegisterNamePage extends StatefulWidget {
  @override
  State<RegisterNamePage> createState() => _RegisterNamePageState();
}

class _RegisterNamePageState extends State<RegisterNamePage> {
  final SecureStorage secureStorage = SecureStorage();
  final lastNameController = TextEditingController();
  final firstNameController = TextEditingController();
  String lastName = '';
  String firstName = '';

  @override
  void initState() {
    super.initState();
    firstNameController.addListener(() => setState(() {}));
    lastNameController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    lastNameController.dispose();
    firstNameController.dispose();
    super.dispose();
  }

  bool inputController(String firstname, String lastname) {
    if (firstname.isEmpty || lastname.isEmpty) {
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
                child: Stack(children: [
      GradientBackground(),
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
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-email');
                      },
                    ),
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
                    'What is your name ?',
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
                        setState(() => firstName = firstNameController.text),
                    onSubmitted: (value) =>
                        setState(() => firstName = firstNameController.text),
                    width: 350,
                    height: 28,
                    labelText: 'First name',
                    prefixIcon: Icon(Icons.account_circle_outlined),
                    suffixIcon: firstNameController.text.isEmpty
                        ? SizedBox(
                            width: 0,
                          )
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => firstNameController.clear(),
                          ),
                    controller: firstNameController,
                  ),
                  SizedBox(
                    height: 40,
                  ),
                  TextInput(
                    backgroundColor: Colors.white.withOpacity(0.5),
                    onChanged: (value) =>
                        setState(() => lastName = lastNameController.text),
                    onSubmitted: (value) =>
                        setState(() => lastName = lastNameController.text),
                    width: 350,
                    height: 28,
                    labelText: 'Last name',
                    prefixIcon: Icon(Icons.account_circle_outlined),
                    suffixIcon: lastNameController.text.isEmpty
                        ? SizedBox(
                            width: 0,
                          )
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => lastNameController.clear(),
                          ),
                    controller: lastNameController,
                  ),
                  SizedBox(
                    height: 170,
                  ),
                  Button(
                    height: 70,
                    width: 70,
                    radius: 10,
                    color: (!inputController(
                            firstNameController.text, lastNameController.text))
                        ? Color(0xff846b8a)
                        : Colors.grey.withOpacity(0.4),
                    onPressed: (!inputController(
                            firstNameController.text, lastNameController.text))
                        ? () async {
                            secureStorage.storeData('firstname', firstName);
                            secureStorage.storeData('lastname', lastName);
                            Navigator.pushNamed(
                                context, '/register-phone-number');
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
