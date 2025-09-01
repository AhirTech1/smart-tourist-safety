import 'package:flutter/material.dart';

class KycPromptScreen extends StatelessWidget {
  const KycPromptScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Digital ID Expired'),
      content: const SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text('Your temporary digital ID for your previous trip has expired.'),
            SizedBox(height: 16),
            Text('To access safety features for a new trip, you need to complete the KYC process again.'),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Complete KYC Now'),
          onPressed: () {
            // TODO: Navigate to the KYC screen
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Navigate to KYC screen...')),
            );
          },
        ),
        TextButton(
          child: const Text('Later'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }
}
