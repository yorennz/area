import 'package:flutter/material.dart';

class TextInput extends StatelessWidget {
  final String? hintText;
  final String? labelText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final double width;
  final double height;
  final TextEditingController? controller;
  final bool obscureText;
  final Function(String)? onChanged;
  final Function(String)? onSubmitted;
  final TextInputType? keyboardType;
  final Color focusBorder;
  final Color unfocuseBorder;
  final Color backgroundColor;
  final int? maxLines;

  const TextInput(
      {Key? key,
      required this.width,
      required this.height,
      this.controller,
      this.hintText,
      this.labelText,
      this.prefixIcon,
      this.suffixIcon,
      this.obscureText = false,
      this.onChanged,
      this.onSubmitted,
      this.focusBorder = Colors.black,
      this.unfocuseBorder = Colors.black,
      this.keyboardType = TextInputType.emailAddress,
      this.backgroundColor = Colors.white,
      this.maxLines = 1});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: Container(
      width: width,
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: TextField(
        maxLines: maxLines,
        controller: controller,
        textInputAction: TextInputAction.done,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: unfocuseBorder, width: 2)),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: focusBorder, width: 2),
            borderRadius: BorderRadius.circular(15),
          ),
          filled: true,
          fillColor: backgroundColor,
          prefixIconColor: Colors.black,
          suffixIconColor: Colors.black,
          labelStyle: TextStyle(color: Colors.black),
          labelText: labelText,
          hintText: hintText,
          prefixIcon: prefixIcon,
          suffixIcon: suffixIcon,
          contentPadding:
              EdgeInsets.symmetric(vertical: height, horizontal: 20),
        ),
        obscureText: obscureText,
        onChanged: onChanged,
        onSubmitted: onSubmitted,
      ),
    ));
  }
}
