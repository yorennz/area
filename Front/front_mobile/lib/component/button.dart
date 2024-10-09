import 'package:flutter/material.dart';

class Button extends StatelessWidget {
  final double height;
  final double width;
  final double radius;
  final Color color;
  final Widget? child;
  final Function()? onPressed;

  const Button({
    Key? key,
    required this.height,
    required this.width,
    this.radius = 0,
    required this.color,
    this.child,
    this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: TextButton.styleFrom(
        backgroundColor: color,
        minimumSize: Size(width, height),
        padding: EdgeInsets.all(5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radius),
          side: BorderSide(color: color, width: 2), // Add border here
        ),
      ),
      onPressed: onPressed,
      child: child,
    );
  }
}
