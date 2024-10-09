import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  final FlutterSecureStorage storage = FlutterSecureStorage();

  storeData(String key, String? value) async {
    await storage.write(key: key, value: value);
  }

  readData(String key) async {
    String? value = await storage.read(key: key);
    return value;
  }

  deleteData() async {
    return await storage.deleteAll();
  }
}

class ServiceAction {
  Map<String, dynamic> action;

  ServiceAction({
    required this.action,
  });
}

class ServiceReaction {
  Map<String, dynamic> reaction;

  ServiceReaction({
    required this.reaction,
  });
}

class Service {
  List<dynamic> services;

  Service({
    required this.services,
  });
}
