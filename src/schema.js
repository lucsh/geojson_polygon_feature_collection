import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';

const data = [
  {
    nombre: 'Uno',
    color: '#00ffff',
    coordinates: [
      { latitude: 40.1, longitude: -76.5 },
      { latitude: 40.2, longitude: -76.6 },
      { latitude: 40.3, longitude: -76.7 },
      { latitude: 40.1, longitude: -76.5 },
    ],
  },
];

// Construct a schema, using GraphQL schema language
const typeDefs = `
  scalar Coordinates

  type PolygonGeometry {
    type: String!
    coordinates: [Coordinates!]
  }

  type PolygonProps {
    place: String!
    fill:String
  }

  type PolygonObject {
    type: String!
    properties: PolygonProps
    geometry: PolygonGeometry
  }
type FeatureProperties {
  place: String!
  fill: String
}

  type FeatureCollection {
    type: String!
      properties: FeatureProperties!
  features: [PolygonObject]
  }

  type Query {
    respuesta: FeatureCollection
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Coordinates: new GraphQLScalarType({
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value) {
      console.log(value);
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  PolygonGeometry: {
    type() {
      return 'Polygon';
    },
    coordinates(item) {
      let coordsArray = [];
      item.coordinates.map(coord => {
        coordsArray.push([coord.longitude, coord.latitude]);
      });
      console.log(coordsArray);
      return [coordsArray];
    },
  },
  PolygonProps: {
    place(item) {
      return item.nombre;
    },
    fill(item) {
      return item.color;
    },
  },
  PolygonObject: {
    type() {
      return 'Feature';
    },
    geometry(item) {
      return item;
    },
    properties(item) {
      return item;
    },
  },
  FeatureCollection: {
    type() {
      return 'FeatureCollection';
    },
    features(data) {
      return data;
    },
  },
  Query: {
    respuesta(_, args, ctx) {
      return data;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
