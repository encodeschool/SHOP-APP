import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<String> getAIResponse(String userQuery) async {
  final apiKey = dotenv.env['API_KEY_OPENAI'] ?? '';
  final dio = Dio();

  final response = await dio.post(
    'https://api.openai.com/v1/chat/completions',
    options: Options(
      headers: {'Authorization': 'Bearer $apiKey'},
    ),
    data: {
      "model": "gpt-4", // or gpt-3.5-turbo
      "messages": [
        {
          "role": "system",
          "content": "You are an AI assistant for a halal meat shop. "
              "Suggest the best meat for a meal, provide a recipe, "
              "and mention which cuts are commonly available."
        },
        {"role": "user", "content": userQuery}
      ],
    },
  );

  return response.data['choices'][0]['message']['content'];
}
