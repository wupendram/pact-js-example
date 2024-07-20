// import required dependencies
const path = require("path");
const { fetchMovies } = require("./consumer");
const { PactV3, MatchersV3 } = require("@pact-foundation/pact");

// setup the mock provider
const provider = new PactV3({
  consumer: "WebConsumer",
  provider: "MoviesAPI",
  dir: path.resolve(process.cwd(), "pacts"),
});

// register the consumer expectation
EXPECTED_BODY = {
  id: 1,
  name: "My movie",
  year: 1999,
};
describe("Movies API", () => {
  describe("When a GET request is made to /movies", () => {
    test("it should return all movies", async () => {
      provider
        .uponReceiving("a request to get all movies")
        .withRequest({
          method: "GET",
          path: "/movies",
        })
        .willRespondWith({
          status: 200,
          body: MatchersV3.eachLike(EXPECTED_BODY),
        });

      // call the consumer against mock provider
      await provider.executeTest(async (mockProvider) => {
        const movies = await fetchMovies(mockProvider.url);

        // verify the test
        expect(movies[0]).toEqual(EXPECTED_BODY);
      });
    });
  });
});
