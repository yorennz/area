import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';

class AccountInfosSettingPage extends StatefulWidget {
  final String labelText;

  const AccountInfosSettingPage({
    required this.labelText,
  });

  @override
  State<AccountInfosSettingPage> createState() =>
      _AccountInfosSettingPageState();
}

class _AccountInfosSettingPageState extends State<AccountInfosSettingPage> {
  final SecureStorage secureStorage = SecureStorage();
  final valueController = TextEditingController();
  String change = '';
  String firstnameCpy = '';
  String lastnameCpy = '';
  String phoneCpy = '';
  bool error = false;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    valueController.addListener(() => setState(() {}));
    initializeData();
  }

  Future<void> initializeData() async {
    firstnameCpy = await secureStorage.readData('firstname');
    lastnameCpy = await secureStorage.readData('lastname');
    phoneCpy = await secureStorage.readData('phone');
    setState(() {});
  }

  @override
  void dispose() {
    valueController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      child: SingleChildScrollView(
        child: Stack(
          children: [
            Center(
              child: Column(
                children: [
                  ReturnButton(),
                  SizedBox(
                    height: 40,
                  ),
                  TextInput(
                    onChanged: (value) => setState(() => change = value),
                    onSubmitted: (value) => setState(() => change = value),
                    width: 350,
                    height: 20,
                    labelText: widget.labelText,
                    suffixIcon: valueController.text.isEmpty
                        ? SizedBox(
                            width: 0,
                          )
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => valueController.clear(),
                          ),
                    controller: valueController,
                    backgroundColor: Colors.white.withOpacity(0.5),
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
                              height: 50,
                            )
                          ])))
                        : SizedBox(
                            height: 60,
                          ),
                  ),
                  Button(
                    height: 50,
                    width: 350,
                    color: Colors.green,
                    radius: 10,
                    child: Text(
                      'Save',
                      style: TextStyle(
                          fontSize: 15,
                          color: Colors.white,
                          fontWeight: FontWeight.bold),
                    ),
                    onPressed: () async {
                      switch (widget.labelText) {
                        case 'Firstname':
                          await secureStorage.storeData('firstname', change);
                          break;
                        case 'Lastname':
                          await secureStorage.storeData('lastname', change);
                          break;
                        case 'Phone':
                          await secureStorage.storeData('phone', change);
                          break;
                        default:
                          break;
                      }
                      String token = await secureStorage.readData('token');
                      updateUserInformations(
                        token,
                        await secureStorage.readData('firstname'),
                        await secureStorage.readData('lastname'),
                        await secureStorage.readData('phone'),
                      ).then((statusCode) async {
                        if (statusCode == 200) Navigator.pop(context);
                        if (statusCode == 400) {
                          await secureStorage.storeData(
                              'firstname', firstnameCpy);
                          await secureStorage.storeData(
                              'lastname', lastnameCpy);
                          await secureStorage.storeData('phone', phoneCpy);
                          setState(() {
                            valueController.clear();
                          });
                          setState(() {
                            errorMessage =
                                'Please provide a correct ${widget.labelText}';
                          });
                        }
                        setState(() {
                          error = true;
                        });
                      });
                    },
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
