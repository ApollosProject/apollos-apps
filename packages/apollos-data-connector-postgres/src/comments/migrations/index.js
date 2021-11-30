import CreateComments001 from './001_create_comments';
import AddLikedCount002 from './002_add_likedCount';
import RenameCommentFields003 from './003_rename_comment_fields';
import UpdateCommentPersonForeignKey004 from './004_update_comment_person_foreign_key';

const migrations = [
  CreateComments001,
  AddLikedCount002,
  RenameCommentFields003,
  UpdateCommentPersonForeignKey004,
];

export default migrations;
