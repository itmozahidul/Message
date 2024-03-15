package com.shk.ConnectMe.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.shk.ConnectMe.Model.Gifformat;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.URL;

import java.util.ArrayList;
import java.util.List;


@Service
public class TenorGifs  {
	private List<Gifformat> gifs = new ArrayList<Gifformat>();
	private static String API_KEY="AIzaSyCME2ndugUXjJD8nnSO4JNnha1Qlp5ZadQ" ;
    private static String CLIENT_KEY="MozaGifApi";
    

	public TenorGifs() {
		// TODO Auto-generated constructor stub
	}

	
	public List<Gifformat> getGif(String searchTerm,int limit) {
		// TODO Auto-generated method stub
		try {
			 JSONObject searchResult = getSearchResults(searchTerm, limit);
			 JSONArray rs = (JSONArray)searchResult.get("results");rs.get(0);
			 this.gifs = new ArrayList<Gifformat>();
			 for(Object jb :rs) {
				 JSONObject jbo= (JSONObject)jb;
				 JSONObject jbo2= (JSONObject)jbo.get("media_formats");
				 this.gifs.add(new Gifformat(
						 ((JSONObject)jbo2.get("tinygif")).getString("url"),
						 jbo.getString("itemurl")
						 
						 ));
				 
			 }
		}catch(Exception e) {
			
		}
		return this.gifs;
	}
	
	public static JSONObject getSearchResults(String searchTerm, int limit) {

        // make search request - using default locale of EN_US

        final String url = String.format("https://tenor.googleapis.com/v2/search?q=%1$s&key=%2$s&client_key=%3$s&limit=%4$s",
                searchTerm, API_KEY, CLIENT_KEY, limit);
        try {
            return get(url);
        } catch (IOException | JSONException ignored) {
        }
        return null;
    }
	
	private static JSONObject get(String url) throws IOException, JSONException {
        HttpURLConnection connection = null;
        try {
            // Get request
            connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

            // Handle failure
            int statusCode = connection.getResponseCode();
            if (statusCode != HttpURLConnection.HTTP_OK && statusCode != HttpURLConnection.HTTP_CREATED) {
                String error = String.format("HTTP Code: '%1$s' from '%2$s'", statusCode, url);
                throw new ConnectException(error);
            }

            // Parse response
            return parser(connection);
        } catch (Exception ignored) {
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
        return new JSONObject("");
    }
	
	private static JSONObject parser(HttpURLConnection connection) throws JSONException {
        char[] buffer = new char[1024 * 4];
        int n;
        InputStream stream = null;
        try {
            stream = new BufferedInputStream(connection.getInputStream());
            InputStreamReader reader = new InputStreamReader(stream, "UTF-8");
            StringWriter writer = new StringWriter();
            while (-1 != (n = reader.read(buffer))) {
                writer.write(buffer, 0, n);
            }
            return new JSONObject(writer.toString());
        } catch (IOException ignored) {
        } finally {
            if (stream != null) {
                try {
                    stream.close();
                } catch (IOException ignored) {
                }
            }
        }
        return new JSONObject("");
    }

}
