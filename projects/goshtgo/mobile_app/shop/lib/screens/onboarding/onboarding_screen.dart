import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import 'package:shop/l10n/app_localizations.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  List<Map<String, String>> _pages(BuildContext context) => [
    {
      "title": AppLocalizations.of(context)!.onboarding_title_1,
      "subtitle": AppLocalizations.of(context)!.onboarding_subtitle_1,
      "image": "assets/onboarding/onboarding_1_low_resolution.png",
    },
    {
      "title": AppLocalizations.of(context)!.onboarding_title_2,
      "subtitle": AppLocalizations.of(context)!.onboarding_subtitle_2,
      "image": "assets/onboarding/onboarding_2_low.png"
    },
    // {
    //   "title": AppLocalizations.of(context)!.onboarding_title_3,
    //   "subtitle": AppLocalizations.of(context)!.onboarding_subtitle_3,
    //   "image": "assets/images/panda.png",
    // },
  ];

  Future<void> _finishOnboarding(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_shown', true);
    if (mounted) context.go('/login');
  }

  void _nextPage() {
    if (_currentPage == _pages(context).length - 1) {
      _finishOnboarding(context);
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _skip() => _finishOnboarding(context);

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.red[900];
    final pages = _pages(context);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: _skip,
                child: Text(
                  AppLocalizations.of(context)!.skip,
                  style: const TextStyle(color: Colors.grey, fontSize: 16),
                ),
              ),
            ),

            // PageView
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: pages.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  final page = pages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.asset(page["image"]!, width: 200, fit: BoxFit.cover),
                        const SizedBox(height: 40),
                        Text(
                          page["title"]!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          page["subtitle"]!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Dots indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                pages.length,
                    (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  height: 8,
                  width: _currentPage == index ? 20 : 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index ? primaryColor : Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Next / Get Started button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  backgroundColor: primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _nextPage,
                child: Text(
                  _currentPage == pages.length - 1
                      ? AppLocalizations.of(context)!.get_started
                      : AppLocalizations.of(context)!.next,
                  style: const TextStyle(color: Colors.white, fontSize: 18),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
