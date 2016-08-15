import React from 'react';
import { Jest as GulpPlugin } from '../app/components/GulpPlugin';
import renderer from 'react-test-renderer';
import Faker from 'faker';

jest.mock('react/lib/ReactDefaultInjection');

describe('GulpPlugin', () => {
  it('renders without error', () => {


    let GP = {};
    GP.name = Faker.random.word();
    GP.author = Faker.internet.userName();
    GP.version = Faker.random.number();
    GP.keywords = Faker.random.words();
    GP.description = Faker.random.words();
    GP.installed = false;

    const component = renderer.create(
      <GulpPlugin
        index={0}
        name={GP.name}
        author={GP.author}
        version={GP.version}
        description={GP.description}
        keywords={GP.keywords.split('')}
        onPluginSelect={() => {}}
        installed={GP.installed}
        connectDragSource={(props) => props}
      />
    );
    // let tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
    //
  });
});
