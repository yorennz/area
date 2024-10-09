import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/return_button.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
import 'package:front_mobile/pages/account_infos_setting.dart';

class AccountPage extends StatefulWidget {
  final GlobalKey<ScaffoldState> scaffoldKey;
  const AccountPage({required this.scaffoldKey});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  final SecureStorage secureStorage = SecureStorage();

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      child: SingleChildScrollView(
        child: Stack(
          children: [
            Center(
                child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ReturnButton(),
                Text(
                  'Account',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 30),
                ),
                SizedBox(
                  height: 40,
                ),
                AccountButton(
                  value: 'Firstname',
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => AccountInfosSettingPage(
                                  labelText: 'Firstname',
                                )));
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                AccountButton(
                  value: 'Lastname',
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => AccountInfosSettingPage(
                                  labelText: 'Lastname',
                                )));
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                AccountButton(
                  value: 'Email',
                  onPressed: () {},
                ),
                SizedBox(
                  height: 20,
                ),
                AccountButton(
                  value: 'Phone',
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => AccountInfosSettingPage(
                                  labelText: 'Phone',
                                )));
                  },
                ),
                SizedBox(
                  height: 200,
                ),
                Button(
                  height: 50,
                  width: 350,
                  color: Colors.red,
                  radius: 10,
                  child: Text(
                    'Delete your account',
                    style: TextStyle(
                        fontSize: 15,
                        color: Colors.white,
                        fontWeight: FontWeight.bold),
                  ),
                  onPressed: () async {
                    await deleteUserInformations(
                        await secureStorage.readData('token'));
                    final currentContext = widget.scaffoldKey.currentContext;
                    secureStorage.deleteData();
                    // ignore: use_build_context_synchronously
                    Navigator.pushNamed(currentContext!, '/');
                  },
                )
              ],
            )),
          ],
        ),
      ),
    );
  }
}

class AccountButton extends StatefulWidget {
  final dynamic onPressed;
  final String? value;

  const AccountButton({
    this.onPressed,
    this.value = '',
  });

  @override
  State<AccountButton> createState() => _AccountButtonState();
}

class _AccountButtonState extends State<AccountButton> {
  final SecureStorage secureStorage = SecureStorage();
  String firstname = '';
  String lastname = '';
  String email = '';
  String phone = '';
  String label = '';

  @override
  void initState() {
    super.initState();
    executeAction();
  }

  Future<void> executeAction() async {
    firstname = await secureStorage.readData('firstname');
    lastname = await secureStorage.readData('lastname');
    email = await secureStorage.readData('email');
    phone = await secureStorage.readData('phone');
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    switch (widget.value) {
      case 'Firstname':
        label = firstname;
        break;
      case 'Lastname':
        label = lastname;
        break;
      case 'Email':
        label = email;
        break;
      case 'Phone':
        label = phone;
        break;
      default:
        break;
    }
    return Button(
      height: 50,
      width: 350,
      color: Color(0xff846b8a),
      radius: 10,
      onPressed: widget.onPressed,
      child: SizedBox(
        width: 310,
        child: Row(
          children: [
            Expanded(
              child: Row(
                children: [
                  Text(
                    widget.value!,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            FutureBuilder(
              future: executeAction(),
              builder: (context, snapshot) {
                return Text(
                  label,
                  style: TextStyle(
                    fontSize: 15,
                  ),
                );
              },
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
