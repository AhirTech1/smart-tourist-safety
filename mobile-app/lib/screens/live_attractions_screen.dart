import 'package:flutter/material.dart';
import 'package:google_place/google_place.dart';
import 'package:geolocator/geolocator.dart';

class LocalAttractionsScreen extends StatefulWidget {
  const LocalAttractionsScreen({super.key});

  @override
  _LocalAttractionsScreenState createState() => _LocalAttractionsScreenState();
}

class _LocalAttractionsScreenState extends State<LocalAttractionsScreen> {
  final googlePlace = GooglePlace("YOUR_API_KEY_HERE"); // Replace with your key
  List<SearchResult> _attractions = [];
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
      final result = await googlePlace.search.getNearBySearch(
        Location(lat: position.latitude, lng: position.longitude),
        1500,
        type: "tourist_attraction",
      );

      if (result != null && result.results != null) {
        setState(() {
          _attractions = result.results!;
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
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
          : _attractions.isEmpty
              ? const Center(child: Text('No attractions found'))
              : ListView.builder(
                  itemCount: _attractions.length,
                  itemBuilder: (context, index) {
                    final attraction = _attractions[index];
                    return ListTile(
                      title: Text(attraction.name ?? 'Unknown'),
                      subtitle: Text(attraction.vicinity ?? ''),
                    );
                  },
                ),
    );
  }
}
