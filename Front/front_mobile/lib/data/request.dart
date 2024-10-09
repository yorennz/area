import 'dart:async';
import 'package:flutter/widgets.dart';
import 'package:front_mobile/data/config.dart';
import 'package:front_mobile/data/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:front_mobile/pages/area.dart';

Future<int?> loginUser(String email, String password) async {
  final SecureStorage secureStorage = SecureStorage();
  final url = Uri.parse('${AppConfig.url}/auth/login');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  final Map<String, dynamic> requestBody = {
    'email': email,
    'password': password,
  };

  try {
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(requestBody),
    );
    if (response.statusCode == 200) {
      await secureStorage.storeData(
          'token', jsonDecode(response.body)["access_token"]);
    }
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> registerUser(String email, String password, String lastname,
    String firstname, String phone) async {
  final SecureStorage secureStorage = SecureStorage();
  final url = Uri.parse('${AppConfig.url}/auth/register');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  final Map<String, dynamic> requestBody = {
    'email': email,
    'password': password,
    'firstname': firstname,
    'lastname': lastname,
    'phone': phone,
  };

  try {
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(requestBody),
    );
    if (response.statusCode == 201) {
      await secureStorage.storeData(
          'token', jsonDecode(response.body)["access_token"]);
    }
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> getUserInformation(String token) async {
  final SecureStorage secureStorage = SecureStorage();
  final url = Uri.parse('${AppConfig.url}/user/me');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer $token',
  };

  try {
    final response = await http.get(url, headers: headers);
    final stock = jsonDecode(response.body);
    await getAuthorization();
    await secureStorage.storeData('email', stock["email"]);
    await secureStorage.storeData('firstname', stock["firstname"]);
    await secureStorage.storeData('lastname', stock["lastname"]);
    await secureStorage.storeData('phone', stock["phone"]);
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> updateUserInformations(
    String token, String firstname, String lastname, String phone) async {
  // final SecureStorage secureStorage = SecureStorage();
  final url = Uri.parse('${AppConfig.url}/user/me');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer $token',
  };
  final Map<String, dynamic> requestBody = {
    'firstname': firstname,
    'lastname': lastname,
    'phone': phone,
  };

  try {
    final response = await http.put(
      url,
      headers: headers,
      body: jsonEncode(requestBody),
    );
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> deleteUserInformations(String token) async {
  final url = Uri.parse('${AppConfig.url}/user/me');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer $token',
  };

  try {
    final response = await http.delete(url, headers: headers);
    if (response.statusCode == 200) {}
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> createArea(
    String name,
    String description,
    Map<String, dynamic> action,
    Map<String, dynamic> reaction,
    String token) async {
  final url = Uri.parse('${AppConfig.url}/area');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer $token',
  };

  final Map<String, dynamic> requestBody = {
    'name': name,
    'description': description,
    'Action': action,
    'Reaction': reaction,
  };

  try {
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(requestBody),
    );
    if (response.statusCode == 201) {
      print('Area succefully');
    }
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<int?> getArea(String id, String hostArea, String state, String name,
    String description, String action, String reaction) async {
  final url = Uri.parse('${AppConfig.url}/auth/get');
  final Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  final Map<String, dynamic> requestBody = {
    'id': id,
    'hostArea': hostArea,
    'state': state,
    'name': name,
    'description': description,
    'action': action,
    'reaction': reaction,
  };

  try {
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(requestBody),
    );
    if (response.statusCode == 201) {}
    return response.statusCode;
  } catch (error) {
    print('Error: $error');
    return 500;
  }
}

Future<Service?> getServiceInformation() async {
  Service service;
  List<dynamic> servicesList = [];
  final url = Uri.parse('${AppConfig.url}/about.json');

  try {
    final response = await http.get(
      url,
    );
    if (response.statusCode == 200) {
      final stock = jsonDecode(response.body);
      for (int n = 0; n < stock["server"]["services"].length; n++) {
        servicesList.add(stock["server"]["services"][n]);
      }
    }
    service = Service(services: servicesList);
    return service;
  } catch (error) {
    print('Error: $error');
    return null;
  }
}

class LoginDiscord extends StatelessWidget {
  final Completer<WebViewController> controller =
      Completer<WebViewController>();
  final SecureStorage secureStorage = SecureStorage();

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      WebView(
          initialUrl: '${AppConfig.url}/oauth2/login/discord',
          javascriptMode: JavascriptMode.unrestricted,
          onWebViewCreated: (WebViewController webViewController) {
            controller.complete(webViewController);
          },
          navigationDelegate: (NavigationRequest request) async {
            print("WebView is navigating to: ${request.url}");
            Uri uri = Uri.parse(request.url);
            String? token = uri.queryParameters['token'];
            if (token != null) {
              await secureStorage.storeData('token', token);
              // ignore: use_build_context_synchronously
              Navigator.pushNamed(context, '/home');
            }
            return NavigationDecision.navigate;
          },
          onPageFinished: (String url) {
            print('Page finished loading: $url');
          }),
    ]);
  }
}

class LoginGoogle extends StatelessWidget {
  final Completer<WebViewController> controller =
      Completer<WebViewController>();
  final SecureStorage secureStorage = SecureStorage();

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      WebView(
          initialUrl: '${AppConfig.url}/oauth2/login/google',
          javascriptMode: JavascriptMode.unrestricted,
          userAgent: 'random',
          onWebViewCreated: (WebViewController webViewController) {
            controller.complete(webViewController);
          },
          navigationDelegate: (NavigationRequest request) async {
            print("WebView is navigating to: ${request.url}");
            Uri uri = Uri.parse(request.url);
            String? token = uri.queryParameters['token'];
            if (token != null) {
              await secureStorage.storeData('token', token);
              // ignore: use_build_context_synchronously
              Navigator.pushNamed(context, '/home');
            }
            return NavigationDecision.navigate;
          },
          onPageFinished: (String url) {
            print('Page finished loading: $url');
          }),
    ]);
  }
}

class AuthorizeService extends StatefulWidget {
  final String serviceName;

  AuthorizeService({required this.serviceName});

  @override
  State<AuthorizeService> createState() => _AuthorizeServiceState();
}

class _AuthorizeServiceState extends State<AuthorizeService> {
  final Completer<WebViewController> controller =
      Completer<WebViewController>();
  final SecureStorage secureStorage = SecureStorage();

  bool shouldShowWebView = true;

  Future<String> _getToken() async {
    String? token = await secureStorage.readData('token');
    return token ?? '';
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _getToken(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          String accessToken = snapshot.data ?? '';
          return shouldShowWebView ? buildWebView(accessToken) : Container();
        } else {
          return Container();
        }
      },
    );
  }

  Widget buildWebView(String accessToken) {
    return WebView(
      initialUrl:
          '${AppConfig.url}/oauth2/authorize/${widget.serviceName}?authorization=$accessToken',
      javascriptMode: JavascriptMode.unrestricted,
      userAgent: 'random',
      onWebViewCreated: (WebViewController webViewController) {
        controller.complete(webViewController);
      },
      navigationDelegate: (NavigationRequest request) {
        if (request.url
            .startsWith('http://localhost:8081/authorization?status=200')) {
          // Update the state to hide the WebView
          setState(() {
            shouldShowWebView = false;
          });
          Navigator.pushNamed(context, '/');
          return NavigationDecision.prevent;
        }
        return NavigationDecision.navigate;
      },
    );
  }
}

Future<dynamic> getAuthorization() async {
  final SecureStorage secureStorage = SecureStorage();
  final token = await secureStorage.readData("token");
  final url = Uri.parse('${AppConfig.url}/oauth2/authorization');
  final Map<String, String> headers = {
    "authorization": "Bearer $token",
  };
  try {
    final response = await http.get(
      url,
      headers: headers,
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final auth = data["Authorizations"];
      return auth;
    }
    return null;
  } catch (error) {
    return null;
  }
}

Future delAuthorization(service) async {
  final SecureStorage secureStorage = SecureStorage();
  final token = await secureStorage.readData("token");
  final url = Uri.parse('${AppConfig.url}/oauth2/authorize/$service');
  final Map<String, String> headers = {
    "authorization": "Bearer $token",
  };
  try {
    final response = await http.delete(
      url,
      headers: headers,
    );
    if (response.statusCode == 200) {
      return 200;
    }
    return 400;
  } catch (error) {
    return 500;
  }
}

Future<List<Area>> getAreas() async {
  final SecureStorage secureStorage = SecureStorage();
  final token = await secureStorage.readData("token");
  final url = Uri.parse('${AppConfig.url}/area');
  final Map<String, String> headers = {
    "authorization": "Bearer $token",
  };

  try {
    final response = await http.get(url, headers: headers);
    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      List<Area> areas = jsonData.map((data) => Area.fromJson(data)).toList();
      return areas;
    } else {
      throw Exception('Failed to load areas');
    }
  } catch (error) {
    print(error);
    rethrow;
  }
}

Future deleteArea(service) async {
  final SecureStorage secureStorage = SecureStorage();
  final token = await secureStorage.readData("token");
  final url = Uri.parse('${AppConfig.url}/area/$service');
  final Map<String, String> headers = {
    "authorization": "Bearer $token",
  };
  try {
    final response = await http.delete(url, headers: headers);
    if (response.statusCode == 200) {}
  } catch (error) {
    print(error);
    rethrow;
  }
}

Future stateArea(service) async {
  final SecureStorage secureStorage = SecureStorage();
  final token = await secureStorage.readData("token");
  final url = Uri.parse('${AppConfig.url}/area/$service/disable_enable');
  final Map<String, String> headers = {
    "authorization": "Bearer $token",
  };
  try {
    final response = await http.get(url, headers: headers);
    if (response.statusCode == 204) {}
  } catch (error) {
    print(error);
    rethrow;
  }
}
