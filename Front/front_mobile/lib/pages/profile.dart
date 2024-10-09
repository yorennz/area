import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/pages/account.dart';
// import 'package:front_mobile/pages/welcome_page.dart';

class ProfilePage extends StatefulWidget {
  final GlobalKey<ScaffoldState> scaffoldKey;
  const ProfilePage({required this.scaffoldKey});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final SecureStorage secureStorage = SecureStorage();
  String firstname = '';
  String lastname = '';
  String email = '';
  String phone = '';

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
    return GradientBackground(
        child: SingleChildScrollView(
      child: Stack(
        children: [
          Center(
            child: Column(
              children: [
                SizedBox(
                  height: 80,
                ),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(
                      color: Colors.black,
                      width: 2.0,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20.0),
                    child: Image.network(
                      'https://ik.imagekit.io/yynn3ntzglc/cms/medium_Accroche_chat_poil_long_96efb37bbd_4ma1xrsmu.jpg',
                      scale: 5,
                    ),
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
                FutureBuilder(
                  future: executeAction(),
                  builder: (context, snapshot) {
                    return Text(
                      '$firstname $lastname',
                      style: TextStyle(fontSize: 30),
                    );
                  },
                ),
                SizedBox(
                  height: 50,
                ),
                Button(
                  height: 50,
                  width: 350,
                  color: Color(0xff846b8a),
                  radius: 10,
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                AccountPage(scaffoldKey: widget.scaffoldKey)));
                  },
                  child: SizedBox(
                    width: 310,
                    child: Row(
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Icon(
                                Icons.manage_accounts,
                                size: 25,
                              ),
                              SizedBox(width: 15),
                              Text(
                                'Account',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 20,
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(
                  height: 290,
                ),
                Button(
                  height: 50,
                  width: 350,
                  color: Colors.red,
                  radius: 10,
                  child: Text(
                    'Disconnect',
                    style: TextStyle(
                        fontSize: 15,
                        color: Colors.white,
                        fontWeight: FontWeight.bold),
                  ),
                  onPressed: () async {
                    final currentContext = widget.scaffoldKey.currentContext;
                    secureStorage.deleteData();
                    Navigator.pushNamed(currentContext!, '/');
                  },
                )
              ],
            ),
          )
        ],
      ),
    ));
  }
}
