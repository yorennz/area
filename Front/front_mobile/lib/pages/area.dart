import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/data/request.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/service_parsing.dart';

class AreaPage extends StatefulWidget {
  const AreaPage({super.key});

  @override
  State<AreaPage> createState() => _AreaPageState();
}

class Area {
  String name;
  String description;
  Action action;
  Reaction reaction;
  bool isActive;
  bool isDone;

  Area({
    required this.isActive,
    required this.isDone,
    required this.name,
    required this.description,
    required this.action,
    required this.reaction,
  });

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
      isActive: json['isActive'] as bool,
      isDone: json['isDone'] as bool,
      name: json['name'] as String,
      description: json['description'] as String,
      action: Action.fromJson(json['Action']),
      reaction: Reaction.fromJson(json['Reaction']),
    );
  }
}

class Action {
  String service;
  int id;

  Action({
    required this.service,
    required this.id,
  });

  factory Action.fromJson(Map<String, dynamic> json) {
    return Action(
      service: json['service'] as String,
      id: json['id'] as int,
    );
  }
}

class Reaction {
  String service;
  int id;
  Map<String, dynamic>? data; // Make data nullable

  Reaction({
    required this.service,
    required this.id,
    this.data,
  });

  factory Reaction.fromJson(Map<String, dynamic> json) {
    return Reaction(
      service: json['service'] as String,
      id: json['id'] as int,
      data: json.containsKey('data')
          ? Map<String, dynamic>.from(json['data'])
          : null,
    );
  }
}

class _AreaPageState extends State<AreaPage> {
  Service service = Service(services: []);
  List<Area> areas = [];
  ServiceAction action = ServiceAction(action: {});
  ServiceReaction reaction = ServiceReaction(reaction: {});
  Map<String, GlobalKey<State>> switchKeys = {};

  @override
  void initState() {
    super.initState();
    initArea();
    executeAction();
    for (var area in areas) {
      switchKeys[area.name] = GlobalKey();
    }
  }

  Future<void> initArea() async {
    List<Area> areasList = await getAreas();
    setState(() {
      areas = areasList;
    });
  }

  Future<void> executeAction() async {
    service = (await getServiceInformation())!;
    action = actionParsing(service.services);
    reaction = reactionParsing(service.services);
  }

  Future<void> toggleAreaStatus(String name, bool isActive) async {
    await stateArea(name);
    int areaIndex = areas.indexWhere((element) => element.name == name);

    if (areaIndex != -1) {
      setState(() {
        areas[areaIndex].isActive = !isActive;
      });

      // Update the Switch state if the key and its current state are available
      if (switchKeys[name] != null && switchKeys[name]!.currentState != null) {
        switchKeys[name]!.currentState!.setState(() {
          areas[areaIndex].isActive = !isActive;
        });
      }
    }
  }

  Future<void> toggleDeleteArea(String name) async {
    await deleteArea(name);
    await initArea();

    // Supprimer l'élément de la liste areas et mettre à jour l'interface
    setState(() {
      areas.removeWhere((area) => area.name == name);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15, 40, 15, 15),
            child: Column(
              children: [
                ...areas.map((area) {
                  final name = area.name;
                  return Center(
                    child: Column(
                      children: [
                        SizedBox(
                          height: 30,
                        ),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            elevation: 5,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            padding: EdgeInsets.all(0),
                          ),
                          onPressed: () async {
                            showModalBottomSheet(
                              context: context,
                              builder: (BuildContext context) {
                                return SingleChildScrollView(
                                  child: Container(
                                    padding: EdgeInsets.all(20),
                                    child: Column(
                                      children: [
                                        Text(
                                          name,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 20.0,
                                            color:
                                                Color.fromRGBO(96, 54, 107, 1),
                                          ),
                                        ),
                                        Text(
                                          area.description,
                                          style: TextStyle(
                                            fontSize: 15,
                                            color:
                                                Color.fromRGBO(96, 54, 107, 1),
                                          ),
                                        ),
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: <Widget>[
                                            area.isDone
                                                ? Text(
                                                    "Completed",
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  )
                                                : Button(
                                                    height: 30,
                                                    width: 70,
                                                    color: Color.fromRGBO(
                                                        132, 107, 138, 1),
                                                    key: switchKeys[name],
                                                    onPressed: () async {
                                                      await toggleAreaStatus(
                                                          area.name,
                                                          area.isActive);
                                                    },
                                                    child: Text(
                                                      "Change state",
                                                      style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 14,
                                                      ),
                                                    ),
                                                  ),
                                            SizedBox(width: 10),
                                            Button(
                                              height: 30,
                                              width: 70,
                                              color:
                                                  Color.fromRGBO(255, 0, 0, 1),
                                              onPressed: () async {
                                                toggleDeleteArea(name);
                                                Navigator.pop(context);
                                              },
                                              child: Text("Delete Area"),
                                            ),
                                          ],
                                        ),
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.start,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    "Action",
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                  Image.asset(
                                                    'assets/Logo/${area.action.service}.png',
                                                    height: 80,
                                                    width: 80,
                                                  ),
                                                  Text(
                                                    area.action.service,
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 15,
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                  Text(
                                                    action.action[area
                                                                .action.service]
                                                            [area.action.id]
                                                        ["name"],
                                                    style: TextStyle(
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            Expanded(
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.start,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    "Reaction",
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                  Image.asset(
                                                    'assets/Logo/${area.reaction.service}.png',
                                                    height: 70,
                                                    width: 70,
                                                  ),
                                                  Text(
                                                    area.reaction.service,
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 15,
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                  Text(
                                                    reaction.reaction[
                                                                area.reaction
                                                                    .service]
                                                            [area.reaction.id]
                                                        ["name"],
                                                    style: TextStyle(
                                                      color: Color.fromRGBO(
                                                          96, 54, 107, 1),
                                                    ),
                                                  ),
                                                  SingleChildScrollView(
                                                    scrollDirection:
                                                        Axis.vertical,
                                                    child: Column(
                                                      children: [
                                                        if (area.reaction
                                                                .data !=
                                                            null)
                                                          ...area.reaction.data!
                                                              .entries
                                                              .map((entry) {
                                                            return Column(
                                                              children: [
                                                                Text(
                                                                  entry.key,
                                                                  style:
                                                                      TextStyle(
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .bold,
                                                                    color: Color
                                                                        .fromRGBO(
                                                                            96,
                                                                            54,
                                                                            107,
                                                                            1),
                                                                  ),
                                                                ),
                                                                Text(
                                                                  entry.value
                                                                      .toString(),
                                                                  style:
                                                                      TextStyle(
                                                                    color: Color
                                                                        .fromRGBO(
                                                                            96,
                                                                            54,
                                                                            107,
                                                                            1),
                                                                  ),
                                                                ),
                                                              ],
                                                            );
                                                          }).toList(),
                                                      ],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                          child: Card(
                            color: area.isActive
                                ? Color.fromRGBO(250, 227, 227, 1)
                                : Color.fromRGBO(132, 107, 138, 1),
                            elevation: 0,
                            margin: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  name,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 20.0,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Image.asset(
                                            'assets/Logo/${area.action.service}.png',
                                            height: 80,
                                            width: 80,
                                          ),
                                          Text(
                                            "Action",
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16.0,
                                            ),
                                          ),
                                          Text(
                                            area.action.service.toUpperCase(),
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Expanded(
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Image.asset(
                                            'assets/Logo/${area.reaction.service}.png',
                                            height: 80,
                                            width: 80,
                                          ),
                                          Text(
                                            "Reaction",
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16.0,
                                            ),
                                          ),
                                          Text(
                                            area.reaction.service.toUpperCase(),
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                area.isDone
                                    ? Text(
                                        "Completed",
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold),
                                      )
                                    : Switch(
                                        value: area.isActive,
                                        onChanged: (bool value) async {
                                          await toggleAreaStatus(
                                              name, area.isActive);
                                        },
                                      ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
                SizedBox(
                  height: 20,
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    elevation: 5,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                    padding: EdgeInsets.all(0),
                    backgroundColor: Color.fromRGBO(96, 54, 107, 1),
                  ),
                  onPressed: () => initArea(),
                  child: Ink(
                    child: Container(
                      height: 80,
                      width: 300,
                      alignment: Alignment.center,
                      child: Text(
                        "Refresh Area",
                        style: TextStyle(color: Colors.white, fontSize: 20),
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
