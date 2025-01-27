import { assoc, pipe } from 'ramda';
import { createEntity, listEntities, loadEntityById, loadEntityByStixId, now } from '../database/grakn';
import { BUS_TOPICS } from '../config/conf';
import { notify } from '../database/redis';

export const findById = intrusionSetId => {
  if (intrusionSetId.match(/[a-z-]+--[\w-]{36}/g)) {
    return loadEntityByStixId(intrusionSetId);
  }
  return loadEntityById(intrusionSetId);
};
export const findAll = args => {
  const typedArgs = assoc('types', ['Intrusion-Set'], args);
  return listEntities(['name', 'alias'], typedArgs);
};

export const addIntrusionSet = async (user, intrusionSet) => {
  const currentDate = now();
  const intrusionSetToCreate = pipe(
    assoc('first_seen', intrusionSet.first_seen ? intrusionSet.first_seen : currentDate),
    assoc('last_seen', intrusionSet.first_seen ? intrusionSet.first_seen : currentDate)
  )(intrusionSet);
  const created = await createEntity(intrusionSetToCreate, 'Intrusion-Set');
  return notify(BUS_TOPICS.StixDomainEntity.ADDED_TOPIC, created, user);
};
