import 'package:flutter/material.dart';
import 'package:smart_tourist_safety_app/screens/kyc_renewal_screen.dart';

class KycPromptScreen extends StatelessWidget {
  final Map<String, dynamic> tourist;
  
  const KycPromptScreen({
    super.key,
    required this.tourist,
  });

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
            Navigator.of(context).pop();
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => KycRenewalScreen(tourist: tourist),
              ),
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
