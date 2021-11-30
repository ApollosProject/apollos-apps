import CreateFollows001 from './001_create_follows';
import RenameFollowsFields002 from './002_rename_follow_fields';
import FollowPeopleForeignKey003 from './003_follow_people_foreign_key';

const migrations = [
  CreateFollows001,
  RenameFollowsFields002,
  FollowPeopleForeignKey003,
];

export default migrations;
