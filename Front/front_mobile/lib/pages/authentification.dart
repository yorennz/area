import 'package:flutter/material.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
import 'package:flutter/physics.dart';

class AuthentificationPage extends StatefulWidget {
  const AuthentificationPage({Key? key}) : super(key: key);

  @override
  State<AuthentificationPage> createState() => _AuthentificationPageState();
}

class _AuthentificationPageState extends State<AuthentificationPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late SpringSimulation _simulation;

  Service? service;
  List<String> auth = [];

  @override
  void initState() {
    super.initState();
    _initializeService();
    _controller = AnimationController(
        vsync: this,
        lowerBound: 0,
        upperBound: 1); // Animation bounds corrected
    _simulation = SpringSimulation(
        SpringDescription(mass: 0.5, stiffness: 100, damping: 10), 0, 1, 0);
    _controller.animateWith(_simulation);
  }

  Future<void> _initializeService() async {
    service = await getServiceInformation();

    try {
      dynamic tmp = await getAuthorization();
      if (tmp != null && tmp is List<dynamic>) {
        List<String> stringList = tmp.map((e) => e.toString()).toList();
        setState(() {
          auth = stringList;
        });
      }
    } catch (e) {
      print("Error while reading data: $e");
    }
  }

  Future<void> updateAuthorizations() async {
    await _initializeService();
    _controller.animateTo(1.0,
        duration: const Duration(milliseconds: 500), curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget buildAuthList() {
    if (service != null && service!.services.isNotEmpty) {
      return SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: service!.services.where((service) {
            return !auth.contains(service["name"]);
          }).map((service) {
            String logoPath = "assets/Logo/${service["name"]}.png";
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color.fromRGBO(96, 54, 107, 1),
                  padding: EdgeInsets.all(8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          AuthorizeService(serviceName: service["name"]),
                    ),
                  ).then((value) {
                    if (value != null && value) {
                      updateAuthorizations();
                    }
                  });
                },
                child: Image.asset(
                  logoPath,
                  height: 50,
                  width: 50,
                ),
              ),
            );
          }).toList(),
        ),
      );
    } else {
      return Container();
    }
  }

  Widget displayAuthCard() {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ListView.builder(
          itemCount: auth.length,
          itemBuilder: (BuildContext context, int index) {
            String logoPath = "assets/Logo/${auth[index]}.png";
            return SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(1, 0),
                end: Offset(0, 0),
              ).animate(_controller),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Dismissible(
                  key: UniqueKey(),
                  direction: DismissDirection.startToEnd,
                  background: Container(
                    color: Colors.red,
                    alignment: Alignment.centerLeft,
                    child: Icon(Icons.delete),
                  ),
                  onDismissed: (DismissDirection direction) async {
                    if (direction == DismissDirection.startToEnd) {
                      int statusCode = await delAuthorization(auth[index]);
                      if (statusCode == 200) {
                        setState(() {
                          auth.removeAt(index);
                        });
                      } else {
                        // Handle errors or show a message to the user
                      }
                    }
                  },
                  child: Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromRGBO(96, 54, 107, 1),
                            padding: EdgeInsets.all(8),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: () => {},
                          child: Image.asset(
                            logoPath,
                            height: 50,
                            width: 50,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: Column(
          children: <Widget>[
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 80,
                ),
                SizedBox(
                  width: 350,
                  child: Text(
                    "Authorize your account to access all the services",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                SizedBox(
                  height: 30,
                ),
              ],
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: buildAuthListWithStyle(),
            ),
            Expanded(
              child: displayAuthCard(),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildAuthListWithStyle() {
    return Container(
      decoration: BoxDecoration(
        color: Color.fromRGBO(96, 54, 107, 0.5),
        borderRadius: BorderRadius.circular(10.0),
      ),
      constraints: BoxConstraints(maxHeight: 100, maxWidth: 330),
      child: buildAuthList(),
    );
  }
}
