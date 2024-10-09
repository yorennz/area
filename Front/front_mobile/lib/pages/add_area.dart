import 'package:flutter/material.dart';
import 'package:front_mobile/component/button.dart';
import 'package:front_mobile/component/gradient_background.dart';
import 'package:front_mobile/component/text_input.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:front_mobile/data/request.dart';
import 'package:front_mobile/data/service_parsing.dart';
import 'package:dropdown_button2/dropdown_button2.dart';

Map<String, dynamic> savedReactionAction(
    String type, String service, int id, Map<String, dynamic> data) {
  Map<String, dynamic> savedAction = {};
  savedAction[type] = {
    "service": service,
    "id": id,
    "data": data,
  };
  return savedAction;
}

class AddAreaPage extends StatefulWidget {
  const AddAreaPage({super.key});

  @override
  State<AddAreaPage> createState() => _AddAreaPageState();
}

class ServiceModel with ChangeNotifier {
  String actionService = '';
  String get selectedActionService => actionService;

  void changeAction(selectedActionService) {
    actionService = selectedActionService;
    notifyListeners();
  }
}

class _AddAreaPageState extends State<AddAreaPage> {
  final SecureStorage secureStorage = SecureStorage();
  Service service = Service(services: []);
  List<String> name = [];

  ServiceModel actionModel = ServiceModel();
  ServiceModel actionServiceModel = ServiceModel();
  Map<String, dynamic> savedName = {};
  Map<String, dynamic> savedDescription = {};
  Map<String, dynamic> savedAction = {};
  Map<String, dynamic> savedReaction = {};
  Map<String, dynamic> actionsavedData = {};
  Map<String, dynamic> reactionsavedData = {};

  ServiceAction action = ServiceAction(action: {});
  bool isActionSelected = false;
  bool isActionServiceSeleted = false;
  List<Map<String, dynamic>> actionListName = [];
  List<Map<String, dynamic>> actionListDescription = [];
  Map<String, dynamic> actionListData = {};
  String? selectedActionItem;
  int actionid = 0;

  ServiceReaction reaction = ServiceReaction(reaction: {});
  ServiceModel reactionModel = ServiceModel();
  ServiceModel reactionServiceModel = ServiceModel();
  bool isReactionSelected = false;
  bool isReactionServiceSeleted = false;
  List<Map<String, dynamic>> reactionListName = [];
  List<Map<String, dynamic>> reactionListDescription = [];
  Map<String, dynamic> reactionListData = {};
  String? selectedReactionItem;
  int reactionId = 0;

  final titleController = TextEditingController();
  final descriptionController = TextEditingController();

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
  }

  void resetWidget() {
    setState(() {
      isActionSelected = false;
      isActionServiceSeleted = false;
      selectedActionItem = '';
      actionServiceModel = ServiceModel();
      actionModel = ServiceModel();
      actionListName.clear();
      actionListDescription.clear();
      actionListData.clear();

      isReactionSelected = false;
      isReactionServiceSeleted = false;
      selectedReactionItem = '';
      reactionServiceModel = ServiceModel();
      reactionModel = ServiceModel();
      reactionListName.clear();
      reactionListDescription.clear();
      reactionListData.clear();

      savedName.clear();
      savedDescription.clear();
      savedAction.clear();
      savedReaction.clear();
      actionsavedData.clear();
      reactionsavedData.clear();

      titleController.clear();
      descriptionController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return GradientBackground(
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            SizedBox(
              height: 80,
            ),
            Text(
              'Create your Area',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(
              height: 30,
            ),
            isActionSelected
                ? Column(
                    children: [
                      Text('Action:'),
                      SizedBox(
                        height: 10,
                      ),
                    ],
                  )
                : SizedBox(
                    height: 0,
                  ),
            Button(
              height: 80,
              width: 350,
              color: Color.fromRGBO(132, 107, 138, 1),
              radius: 10,
              onPressed: () {
                actionModalPage(context, service.services);
              },
              child: isActionSelected
                  ? Column(
                      children: [
                        Image.asset(
                          'assets/Logo/${actionServiceModel.actionService}.png',
                          height: 40,
                          width: 40,
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Text(actionModel.actionService,
                            style: TextStyle(color: Colors.white, fontSize: 12))
                      ],
                    )
                  : Text(
                      'Select your action',
                      style: TextStyle(color: Colors.white, fontSize: 20),
                    ),
            ),
            isReactionSelected
                ? Column(
                    children: [
                      SizedBox(
                        height: 10,
                      ),
                      Text('Reaction:'),
                    ],
                  )
                : SizedBox(
                    height: 10,
                  ),
            isActionSelected
                ? Column(
                    children: [
                      SizedBox(
                        height: 10,
                      ),
                      Button(
                        height: 80,
                        width: 350,
                        color: Color.fromRGBO(132, 107, 138, 1),
                        radius: 10,
                        onPressed: () {
                          reactionModalPage(context, service.services);
                        },
                        child: isReactionSelected
                            ? Column(
                                children: [
                                  Image.asset(
                                    'assets/Logo/${reactionServiceModel.actionService}.png',
                                    height: 40,
                                    width: 40,
                                  ),
                                  SizedBox(
                                    height: 10,
                                  ),
                                  Text(reactionModel.actionService,
                                      style: TextStyle(
                                          color: Colors.white, fontSize: 12))
                                ],
                              )
                            : Text(
                                'Select your reaction',
                                style: TextStyle(
                                    color: Colors.white, fontSize: 20),
                              ),
                      ),
                    ],
                  )
                : SizedBox(
                    height: 0,
                  ),
            isReactionSelected
                ? Column(
                    children: [
                      SizedBox(
                        height: 30,
                      ),
                      TextInput(
                        width: 350,
                        height: 25,
                        hintText: 'Name',
                        focusBorder: Colors.black26,
                        unfocuseBorder: Colors.black26,
                        onChanged: (value) {
                          setState(() {
                            savedName['name'] = titleController.text;
                          });
                        },
                        onSubmitted: (value) {
                          setState(() {
                            savedName['name'] = titleController.text;
                          });
                        },
                        controller: titleController,
                      ),
                      SizedBox(
                        height: 30,
                      ),
                      TextInput(
                        maxLines: null,
                        width: 350,
                        height: 25,
                        hintText: 'Description',
                        focusBorder: Colors.black26,
                        unfocuseBorder: Colors.black26,
                        onChanged: (value) {
                          setState(() {
                            savedDescription['description'] =
                                descriptionController.text;
                          });
                        },
                        onSubmitted: (value) {
                          setState(() {
                            savedDescription['description'] =
                                descriptionController.text;
                          });
                        },
                        controller: descriptionController,
                      )
                    ],
                  )
                : SizedBox(height: 0),
            SizedBox(
              height: 30,
            ),
            isReactionSelected
                ? Button(
                    height: 50,
                    width: 350,
                    color: Colors.green,
                    radius: 10,
                    child: Text(
                      'Create',
                      style: TextStyle(
                          fontSize: 15,
                          color: Colors.white,
                          fontWeight: FontWeight.bold),
                    ),
                    onPressed: () async {
                      String token = await secureStorage.readData('token');
                      createArea(
                          savedName['name'],
                          savedDescription['description'],
                          savedAction['Action'],
                          savedReaction['Reaction'],
                          token);
                      resetWidget();
                    },
                  )
                : SizedBox(height: 0),
            SizedBox(
              height: 30,
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> generateActionContainers() {
    List<Widget> containersList = [];

    for (int i = 0; i < name.length; i++) {
      containersList.add(
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Button(
            radius: 10,
            width: 70,
            height: 70,
            color: Color(0xff60366B),
            child: Image.asset(
              'assets/Logo/${name[i]}.png',
              height: 40,
              width: 40,
            ),
            onPressed: () {
              isActionServiceSeleted = true;
              actionServiceModel.changeAction(name[i]);
              actionModel.changeAction('');
              actionListName.clear();
              actionListDescription.clear();
              actionListData.clear();
              if (!action.action.containsKey(name[i])) {
                actionListName = [];
                actionListDescription = [];
                selectedActionItem = '';
              } else {
                if (action.action[name[i]].isEmpty) {
                  actionListName = [];
                  actionListDescription = [];
                  selectedActionItem = '';
                } else {
                  actionid = 0;
                  for (final trigger in action.action[name[i]]) {
                    actionListName.add({'name': trigger['name']});
                    actionListDescription
                        .add({'description': trigger['description']});
                    actionListData[trigger['description']] = trigger['data'];
                  }
                  selectedActionItem = actionListDescription[0]['description'];
                }
              }
              actionModel.changeAction(selectedActionItem);
            },
          ),
        ),
      );
    }
    return containersList;
  }

  actionModalPage(context, services) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Color(0xfffae3e3),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          child: SizedBox(
            height: 500,
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      'Select your service',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 20),
                      height: 80,
                      width: 350,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Color(0xff846b8a),
                      ),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: generateActionContainers(),
                        ),
                      ),
                    ),
                    Text(
                      'Your selected service',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    ListenableBuilder(
                      listenable: actionServiceModel,
                      builder: (context, Widget? child) {
                        return Button(
                          height: 70,
                          width: 70,
                          radius: 10,
                          color: Color(0xff846b8a),
                          child: actionServiceModel.actionService == ''
                              ? SizedBox(
                                  width: 0,
                                )
                              : Image.asset(
                                  'assets/Logo/${actionServiceModel.actionService}.png',
                                  height: 40,
                                  width: 40,
                                ),
                        );
                      },
                    ),
                    ListenableBuilder(
                      listenable: actionServiceModel,
                      builder: (context, Widget? child) {
                        return Text(
                          actionServiceModel.actionService,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        );
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      'Select your action',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    SizedBox(
                      height: 60,
                      child: ListenableBuilder(
                        listenable: actionModel,
                        builder: (context, Widget? child) {
                          return DropdownButtonHideUnderline(
                            child: DropdownButton2<String>(
                              isExpanded: true,
                              dropdownStyleData: DropdownStyleData(
                                maxHeight: 200,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                scrollbarTheme: ScrollbarThemeData(
                                  radius: const Radius.circular(40),
                                  thickness:
                                      MaterialStateProperty.all<double>(6),
                                  thumbVisibility:
                                      MaterialStateProperty.all<bool>(true),
                                ),
                              ),
                              menuItemStyleData: const MenuItemStyleData(
                                height: 60,
                                padding: EdgeInsets.only(left: 14, right: 14),
                              ),
                              buttonStyleData: ButtonStyleData(
                                padding:
                                    const EdgeInsets.only(left: 14, right: 14),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                  color: Colors.white,
                                  border: Border.all(
                                    color: Colors.black26,
                                    width: 2,
                                  ),
                                ),
                              ),
                              value: actionModel.actionService,
                              items: actionListDescription.map(
                                (actionListDescription) {
                                  return DropdownMenuItem<String>(
                                    value: actionListDescription['description'],
                                    child: Text(
                                      actionListDescription['description'],
                                      style: TextStyle(fontSize: 15),
                                      overflow: TextOverflow.visible,
                                    ),
                                  );
                                },
                              ).toList(),
                              onChanged: (String? newValue) {
                                actionModel.changeAction(newValue);
                                actionid = actionListData.keys
                                    .toList()
                                    .indexOf(actionModel.actionService);
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text('*Optional'),
                    ListenableBuilder(
                      listenable: actionModel,
                      builder: (context, Widget? child) {
                        return Column(
                          children:
                              actionDataContainer(actionModel.actionService),
                        );
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Button(
                      height: 50,
                      width: 100,
                      color: Colors.green,
                      radius: 10,
                      child: Text(
                        'Save',
                        style: TextStyle(
                            fontSize: 15,
                            color: Colors.white,
                            fontWeight: FontWeight.bold),
                      ),
                      onPressed: () {
                        if (isActionServiceSeleted &&
                            actionModel.actionService != '') {
                          setState(() {
                            isActionSelected = true;
                          });
                          savedAction = savedReactionAction(
                              'Action',
                              actionServiceModel.actionService,
                              actionid,
                              actionsavedData);

                          Navigator.pop(context);
                        }
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  List<Widget> actionDataContainer(actionService) {
    List<Widget> containersList = [];
    bool isBool = false;
    bool defaultValue = false;

    if (actionListName.isEmpty) return containersList;
    actionListData[actionService].forEach(
      (key, value) {
        final dataController = TextEditingController();
        value.contains('*boolean*') ? isBool = true : isBool = false;
        value.contains('Default: false')
            ? defaultValue = false
            : defaultValue = true;
        value = value.replaceAll('*boolean*', '');
        value = value.replaceAll('*optional*', '*');

        containersList.add(
          Column(
            children: [
              SizedBox(
                height: 10,
              ),
              Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              isBool
                  ? SwitchButton(
                      toggle: defaultValue,
                      key1: key,
                      value: value,
                      savedData: actionsavedData,
                    )
                  : Container(
                      margin: const EdgeInsets.symmetric(vertical: 10),
                      child: TextInput(
                        onChanged: (value) {
                          setState(() {
                            actionsavedData[key] = dataController.text;
                          });
                        },
                        onSubmitted: (value) {
                          setState(() {
                            actionsavedData[key] = dataController.text;
                          });
                        },
                        width: 350,
                        height: 20,
                        hintText: key,
                        focusBorder: Colors.black26,
                        unfocuseBorder: Colors.black26,
                        controller: dataController,
                      ),
                    ),
            ],
          ),
        );
      },
    );
    return containersList;
  }

  List<Widget> generateReactionContainers() {
    List<Widget> containersList = [];

    for (int i = 0; i < name.length; i++) {
      containersList.add(
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Button(
            radius: 10,
            width: 70,
            height: 70,
            color: Color(0xff60366B),
            child: Image.asset(
              'assets/Logo/${name[i]}.png',
              height: 40,
              width: 40,
            ),
            onPressed: () {
              isReactionServiceSeleted = true;
              reactionServiceModel.changeAction(name[i]);
              reactionModel.changeAction('');
              reactionListName.clear();
              reactionListDescription.clear();
              reactionListData.clear();
              if (!reaction.reaction.containsKey(name[i])) {
                reactionListName = [];
                reactionListDescription = [];
                selectedReactionItem = '';
              } else {
                reactionId = 0;
                if (reaction.reaction[name[i]].isEmpty) {
                  reactionListName = [];
                  reactionListDescription = [];
                  selectedReactionItem = '';
                } else {
                  for (final trigger in reaction.reaction[name[i]]) {
                    reactionListName.add({'name': trigger['name']});
                    reactionListDescription
                        .add({'description': trigger['description']});
                    reactionListData[trigger['description']] = trigger['data'];
                  }
                  selectedReactionItem =
                      reactionListDescription[0]['description'];
                }
              }
              reactionModel.changeAction(selectedReactionItem);
            },
          ),
        ),
      );
    }
    return containersList;
  }

  reactionModalPage(context, services) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Color(0xfffae3e3),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          child: SizedBox(
            height: 500,
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      'Select your service',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 20),
                      height: 80,
                      width: 350,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Color(0xff846b8a),
                      ),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: generateReactionContainers(),
                        ),
                      ),
                    ),
                    Text(
                      'Your selected service',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    ListenableBuilder(
                      listenable: reactionServiceModel,
                      builder: (context, Widget? child) {
                        return Button(
                          height: 70,
                          width: 70,
                          radius: 10,
                          color: Color(0xff846b8a),
                          child: reactionServiceModel.actionService == ''
                              ? SizedBox(
                                  width: 0,
                                )
                              : Image.asset(
                                  'assets/Logo/${reactionServiceModel.actionService}.png',
                                  height: 40,
                                  width: 40,
                                ),
                        );
                      },
                    ),
                    ListenableBuilder(
                      listenable: reactionServiceModel,
                      builder: (context, Widget? child) {
                        return Text(
                          reactionServiceModel.actionService,
                          style: TextStyle(fontWeight: FontWeight.w600),
                        );
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      'Select your reaction',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    SizedBox(
                      height: 60,
                      child: ListenableBuilder(
                        listenable: reactionModel,
                        builder: (context, Widget? child) {
                          return DropdownButtonHideUnderline(
                            child: DropdownButton2<String>(
                              isExpanded: true,
                              dropdownStyleData: DropdownStyleData(
                                maxHeight: 200,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                scrollbarTheme: ScrollbarThemeData(
                                  radius: const Radius.circular(40),
                                  thickness:
                                      MaterialStateProperty.all<double>(6),
                                  thumbVisibility:
                                      MaterialStateProperty.all<bool>(true),
                                ),
                              ),
                              menuItemStyleData: const MenuItemStyleData(
                                height: 60,
                                padding: EdgeInsets.only(left: 14, right: 14),
                              ),
                              buttonStyleData: ButtonStyleData(
                                padding:
                                    const EdgeInsets.only(left: 14, right: 14),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                  color: Colors.white,
                                  border: Border.all(
                                    color: Colors.black26,
                                    width: 2,
                                  ),
                                ),
                              ),
                              value: reactionModel.actionService,
                              items: reactionListDescription.map(
                                (reactionListDescription) {
                                  return DropdownMenuItem<String>(
                                    value:
                                        reactionListDescription['description'],
                                    child: Text(
                                      reactionListDescription['description'],
                                      style: TextStyle(fontSize: 15),
                                      overflow: TextOverflow.visible,
                                    ),
                                  );
                                },
                              ).toList(),
                              onChanged: (String? newValue) {
                                reactionModel.changeAction(newValue);
                                reactionId = reactionListData.keys
                                    .toList()
                                    .indexOf(reactionModel.actionService);
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text('*Optional'),
                    ListenableBuilder(
                      listenable: reactionModel,
                      builder: (context, Widget? child) {
                        return Column(
                          children: reactionDataContainer(
                              reactionModel.actionService),
                        );
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Button(
                      height: 50,
                      width: 100,
                      color: Colors.green,
                      radius: 10,
                      child: Text(
                        'Save',
                        style: TextStyle(
                            fontSize: 15,
                            color: Colors.white,
                            fontWeight: FontWeight.bold),
                      ),
                      onPressed: () {
                        if (isReactionServiceSeleted &&
                            reactionModel.actionService != '') {
                          setState(() {
                            isReactionSelected = true;
                          });
                          savedReaction = savedReactionAction(
                              'Reaction',
                              reactionServiceModel.actionService,
                              reactionId,
                              reactionsavedData);
                          Navigator.pop(context);
                        }
                      },
                    ),
                    SizedBox(
                      height: 10,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  bool inputController(String email, String password) {
    if (email.isEmpty || password.isEmpty) {
      return true;
    } else {
      return false;
    }
  }

  List<Widget> reactionDataContainer(reactionService) {
    List<Widget> containersList = [];
    bool isBool = false;
    bool defaultValue = false;
    // bool isOptional = false;
    bool error = false;

    if (reactionListName.isEmpty) return containersList;
    reactionListData[reactionService].forEach(
      (key, value) {
        final dataController = TextEditingController();
        value.contains('*boolean*') ? isBool = true : isBool = false;
        // value.contains('*optional*') ? isOptional = true : isOptional = false;
        value.contains('Default: false')
            ? defaultValue = false
            : defaultValue = true;
        value = value.replaceAll('*boolean*', '');
        value = value.replaceAll('*optional*', '*');

        containersList.add(
          Column(
            children: [
              SizedBox(
                height: 10,
              ),
              Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              isBool
                  ? SwitchButton(
                      toggle: defaultValue,
                      key1: key,
                      value: value,
                      savedData: reactionsavedData,
                    )
                  : Container(
                      margin: const EdgeInsets.symmetric(vertical: 10),
                      child: TextInput(
                        width: 350,
                        height: 20,
                        hintText: key,
                        focusBorder: error ? Colors.black : Colors.black26,
                        unfocuseBorder: error ? Colors.black : Colors.black26,
                        controller: dataController,
                        onChanged: (value) {
                          setState(() {
                            error = true;
                            reactionsavedData[key] = dataController.text;
                          });
                        },
                        onSubmitted: (value) {
                          setState(() {
                            reactionsavedData[key] = dataController.text;
                          });
                        },
                      ),
                    ),
            ],
          ),
        );
      },
    );
    return containersList;
  }
}

class SwitchButton extends StatefulWidget {
  final bool toggle;
  final String key1;
  final String value;
  final Map<String, dynamic> savedData;
  SwitchButton(
      {required this.toggle,
      required this.key1,
      required this.value,
      required this.savedData});

  @override
  State<SwitchButton> createState() => _SwitchButtonState();
}

class _SwitchButtonState extends State<SwitchButton> {
  late bool swap;

  @override
  void initState() {
    super.initState();
    swap = widget.toggle;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: <Widget>[
        Switch(
          value: swap,
          onChanged: (bool value) {
            setState(() {
              swap = value;
              widget.savedData[widget.key1] = swap;
            });
          },
        ),
      ],
    );
  }
}
