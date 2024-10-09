import 'package:front_mobile/data/flutter_secure_storage.dart';

ServiceAction actionParsing(final stock) {
  Map<String, dynamic> tmp = {};

  ServiceAction action;

  for (int i = 0; i < stock.length; i++) {
    tmp[stock[i]['name']] = stock[i]['actions'];
  }
  action = ServiceAction(action: tmp);
  return action;
}

ServiceReaction reactionParsing(final stock) {
  Map<String, dynamic> tmp = {};

  ServiceReaction reaction;

  for (int i = 0; i < stock.length; i++) {
    tmp[stock[i]['name']] = stock[i]['reactions'];
  }
  reaction = ServiceReaction(reaction: tmp);
  return reaction;
}
