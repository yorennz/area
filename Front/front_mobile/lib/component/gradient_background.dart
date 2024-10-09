import 'package:flutter/material.dart';

class GradientBackground extends StatelessWidget {
  final Widget? child;
  const GradientBackground({Key? key, this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
          gradient: LinearGradient(
        colors: [
          Color(0xfffae3e3),
          Color(0xfff7d4bc),
          Color(0xffcfa5b4),
          Color(0xffb993c3),
          Color(0xffc39dd4),
        ],
        begin: Alignment.bottomRight,
        end: Alignment.topLeft,
      )),
      child: child,
    );
  }
}
