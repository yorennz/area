import 'package:flutter/material.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
import 'package:front_mobile/pages/add_area.dart';
import 'package:front_mobile/pages/area.dart';
import 'package:front_mobile/pages/dashboard.dart';
import 'package:front_mobile/pages/profile.dart';
import 'package:front_mobile/pages/authentification.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final SecureStorage secureStorage = SecureStorage();
  GlobalKey<ScaffoldState> scaffoldKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    executeAction();
  }

  void executeAction() async {
    getUserInformation(await secureStorage.readData('token'));
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      child: Scaffold(
        key: scaffoldKey,
        body: Stack(
          children: [
            buildOffstageNavigator(0, scaffoldKey),
            buildOffstageNavigator(1, scaffoldKey),
            buildOffstageNavigator(2, scaffoldKey),
            buildOffstageNavigator(4, scaffoldKey),
            buildOffstageNavigator(3, scaffoldKey),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          unselectedItemColor: Colors.black,
          selectedFontSize: 20,
          selectedIconTheme:
              IconThemeData(color: Color.fromRGBO(132, 107, 138, 1), size: 40),
          selectedItemColor: Color.fromRGBO(132, 107, 138, 1),
          selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.space_dashboard_outlined),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.widgets_outlined),
              label: 'Area',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.add),
              label: 'Add',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.security_rounded),
              label: 'Authentification',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_circle_outlined),
              label: 'Profile',
            ),
          ],
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() {
            _selectedIndex = index;
          }),
        ),
      ),
      onWillPop: () async {
        return false;
      },
    );
  }

  Map<String, WidgetBuilder> _routeBuilders(
      BuildContext context, int index, GlobalKey<ScaffoldState> scaffoldKey) {
    return {
      '/': (context) {
        return [
          DashBoardPage(),
          AreaPage(),
          AddAreaPage(),
          AuthentificationPage(),
          ProfilePage(scaffoldKey: scaffoldKey),
        ].elementAt(index);
      },
    };
  }

  Widget buildOffstageNavigator(
      int index, GlobalKey<ScaffoldState> scaffoldKey) {
    var routeBuilders = _routeBuilders(context, index, scaffoldKey);

    return Offstage(
      offstage: _selectedIndex != index,
      child: Navigator(
        onGenerateRoute: (routeSettings) {
          return MaterialPageRoute(
            builder: (context) => routeBuilders[routeSettings.name]!(context),
          );
        },
      ),
    );
  }
}
