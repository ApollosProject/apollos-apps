import { ReactNativeFile } from 'apollo-upload-client';
import { gql } from '@apollo/client';
import { launchImageLibrary } from 'react-native-image-picker';

import GET_USER_PHOTO from '../../UserAvatarConnected/getUserPhoto';

const options = {
  quality: 0.7,
  mediaType: 'photo',
};

async function showImagePicker() {
  return new Promise((resolve, reject) => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        reject(response.didCancel);
      } else if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
}

export default async ({ client, onUpload = () => ({}) }) => {
  try {
    const image = await showImagePicker();
    const file = new ReactNativeFile({
      uri: image.uri,
      name: image.fileName,
      type: 'image/jpeg',
    });
    onUpload();
    return client.mutate({
      mutation: gql`
        mutation uploadProfileImage($file: Upload!, $size: Int!) {
          uploadProfileImage(file: $file, size: $size) {
            id
            firstName
            lastName
            photo {
              uri
            }
          }
        }
      `,
      variables: { file, size: image.fileSize },
      update: (
        cache,
        {
          data: {
            uploadProfileImage: { photo },
          },
        }
      ) => {
        const data = cache.readQuery({ query: GET_USER_PHOTO });

        cache.writeQuery({
          query: GET_USER_PHOTO,
          data: {
            currentUser: {
              ...data.currentUser,
              profile: {
                ...data.currentUser.profile,
                photo,
              },
            },
          },
        });
      },
    });
  } catch (e) {
    console.warn(e);
    return null;
  }
};
