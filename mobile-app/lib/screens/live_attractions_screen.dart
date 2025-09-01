import 'package:flutter/material.dart';
import 'package:google_maps_webservice/places.dart';
import 'package:geolocator/geolocator.dart';

class LocalAttractionsScreen extends StatefulWidget {
  const LocalAttractionsScreen({super.key});

  @override
  _LocalAttractionsScreenState createState() => _LocalAttractionsScreenState();
}

class _LocalAttractionsScreenState extends State<LocalAttractionsScreen> {
  final places = GoogleMapsPlaces(apiKey: "AIzaSyBXg73KaiV_Dgr33WSGhCvnG7C1sceWbgc");
  List<PlacesSearchResult> _attractions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLocalAttractions();
  }

  Future<void> _fetchLocalAttractions() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() => _isLoading = false);
          return;
        }
      }

      final position = await Geolocator.getCurrentPosition();
      final location = Location(lat: position.latitude, lng: position.longitude);
      final result = await places.searchNearbyWithRadius(location, 1500, type: "tourist_attraction");

      if (result.status == "OK") {
        setState(() {
          _attractions = result.results;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Local Attractions'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _attractions.length,
              itemBuilder: (context, index) {
                final attraction = _attractions[index];
                return ListTile(
                  title: Text(attraction.name),
                  subtitle: Text(attraction.vicinity ?? ''),
                );
              },
            ),
    );
  }
}