import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';

class RegisterPhoneNumberPage extends StatefulWidget {
  @override
  State<RegisterPhoneNumberPage> createState() =>
      _RegisterPhoneNumberPageState();
}

class _RegisterPhoneNumberPageState extends State<RegisterPhoneNumberPage> {
  final SecureStorage secureStorage = SecureStorage();
  final numberController = TextEditingController();
  String number = '';
  bool error = false;

  @override
  void initState() {
    super.initState();

    numberController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    numberController.dispose();
    super.dispose();
  }

  bool checkPhoneFormat(String number) {
    final RegExp regex = RegExp(r'^[0-9\s]+$');
    return regex.hasMatch(number);
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
                      height: 5,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-email');
                      },
                    ),
                    Button(
                      height: 5,
                      width: 45,
                      radius: 4,
                      color: Colors.white,
                      onPressed: () {
                        Navigator.pop(context, '/register-name');
                      },
                    ),
                    Button(
                      height: 5,
                      width: 45,
                      radius: 4,
                      color: Color(0xff846b8a),
                    ),
                    Button(
                      height: 5,
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
                    'What is your number ?',
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
                        setState(() => number = numberController.text),
                    onSubmitted: (value) =>
                        setState(() => number = numberController.text),
                    width: 350,
                    height: 28,
                    hintText: '1234567890',
                    labelText: 'Phone Number',
                    prefixIcon: Icon(Icons.phone_iphone),
                    suffixIcon: numberController.text.isEmpty
                        ? SizedBox(
                            width: 0,
                          )
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => numberController.clear(),
                          ),
                    controller: numberController,
                    keyboardType: TextInputType.number,
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
                              'Please provide a correct phone number.',
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
                    color: numberController.text.isNotEmpty
                        ? Color(0xff846b8a)
                        : Colors.grey.withOpacity(0.4),
                    onPressed: (numberController.text.isNotEmpty)
                        ? () async {
                            if (checkPhoneFormat(numberController.text)) {
                              await secureStorage
                                  .storeData('phonenumber', number)
                                  .then((value) => Navigator.pushNamed(
                                      context, '/register-password'));
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
