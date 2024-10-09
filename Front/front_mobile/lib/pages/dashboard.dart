import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
import 'package:front_mobile/data/service_parsing.dart';

class DashBoardPage extends StatefulWidget {
  const DashBoardPage({super.key});

  @override
  State<DashBoardPage> createState() => _DashBoardPageState();
}

class _DashBoardPageState extends State<DashBoardPage> {
  Service service = Service(services: []);
  ServiceAction action = ServiceAction(action: {});
  ServiceReaction reaction = ServiceReaction(reaction: {});
  List<String> name = [];
  int nbService = 0;
  int nbAction = 0;
  int nbReaction = 0;

  @override
  void initState() {
    super.initState();
    executeAction();
  }

  Future<void> executeAction() async {
    service = (await getServiceInformation())!;
    for (int n = 0; n < service.services.length; n++) {
      name.add(service.services[n]['name']);
    }
    action = actionParsing(service.services);
    reaction = reactionParsing(service.services);
    nbService = name.length;
    for (int n = 0; n < name.length; n++) {
      if (action.action.containsKey(name[n])) {
        List<dynamic> list = action.action[name[n]];
        for (var item in list) {
          if (item is Map && item.containsKey('name')) {
            nbAction++;
          }
        }
      }
    }
    for (int n = 0; n < name.length; n++) {
      if (reaction.reaction.containsKey(name[n])) {
        List<dynamic> list = reaction.reaction[name[n]];
        for (var item in list) {
          if (item is Map && item.containsKey('name')) {
            nbReaction++;
          }
        }
      }
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      child: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              height: 80,
            ),
            SizedBox(
              width: 350,
              child: Button(
                height: 80,
                width: 350,
                color: Color.fromRGBO(250, 227, 227, 1),
                radius: 10,
                onPressed: () {},
                child: Center(
                  child: Column(
                    children: [
                      Text(
                        'Total service:',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        nbService.toString(),
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 25,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 30,
            ),
            SizedBox(
              width: 350,
              height: 120,
              child: Button(
                height: 100,
                width: 350,
                color: Color.fromRGBO(250, 227, 227, 1),
                radius: 10,
                onPressed: () {},
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: SizedBox(
                        child: Center(
                          child: Column(
                            children: [
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'Total action:',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 15,
                                ),
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                nbAction.toString(),
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 25,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Divider(
                      color: Colors.black,
                      thickness: 20.0,
                      height: 100,
                    ),
                    Expanded(
                      child: SizedBox(
                        child: Center(
                          child: Column(
                            children: [
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'Total reaction:',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 15,
                                ),
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                nbReaction.toString(),
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 25,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
