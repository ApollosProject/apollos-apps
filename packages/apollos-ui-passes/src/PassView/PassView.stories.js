import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';

import PassView from '.';

const passData = {
  id: 'Pass:164410fae995cd5efe1cce582c912a5f',
  type: 'GENERIC',
  description: 'Apollos Church',
  logo: {
    uri:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAAAXNSR0IArs4c6QAABGFJREFUaAXtWktPU0EUPuX9aHlaeYmIvCkUqEBcGA0GiVFCjAYE6sKdK9f8A3+BiTt3riioiIpBNBrDyoCUt4AaQ4yJUQmPUsrLGUxrezsz9869cyGVns29M2fOzPnmnDn3zGkNcOv2LhwCijgEGPcghoH+b5YOWzRs0RDdgbDrhqjhqGofGotGUbdAIONadSU8uNlJnXFodg4u37tP5Ytg7ItFb9TZmLo2FBdCVpKJOUYrU3egZqMRLpQVM/WMMBigo7aaOUYrU3egbTYrREXIL9NZW6MVC1NeXgOmuDzTLuO23hkqsrPAmpPpbQp/6gq05KgZbLk5ipWWO8uKJyIM1BUor+JttmqIROdVD9INKFa3nTPAZKLI21hSpAdO0A3oucICyE1N4Va6s06foKQb0M56usJ3BoZgdWODuAktVgsYY2OIPC2dugCNj46Gq1UVRL22dnbg7tth6B+fIvJZskQBhZ26AG2xliOrxBJVeDU7D79cLugeHSfycae9np1JUQUZDF2Asr6djtGxPXUGZz7CsttNVO1swUl0vpOJPLWdwoFmmOiRc3N7G/rGp/d09eB3J9l9DegT035KbEooHChWEOeuJHo5MwdL6+s+luOD0/cufbELTgmFA7UzPg/do4HAhjBw1z/g/mBLMzO4sip/WdK7UKCWrEyUr2aR1gHP1hb0T/x1W++ATRSBH49PeptBT97MKmgCvw6hQFmKvZgmBx/HSKCV/XSD1hplNx9/Gdq7MKD4XF63VdHWAdp5fD23AD/X1ohyZpMRmmTuskRBQqcwoOdRlSA7JYmwBIB7cxOeStzWOxAnEI+cdPcVFZSEAWVdnAemZlHK5/FiC3r2jNCTh+bKckiOiwuS4e0QAjQxJgauVFmoa0ujrXTgm/kF+LGyKu3ea8dGRQEurmklIUAxyAQElkQujweeT86QWL6+7d1deOic8LWlLyJuNEKAstz2GQLpQmdUjhyM3PdMQT6cSEuVm4LJ1ww0O9kEOBDRyCFJEmjj3i18hu/LKzS25iqhZqA45cO5KYnWUADCgUgJ7SD37R2jByXWRUHJ/JqBspKE/okpcKOMSCn1MNy30HwE6vNylU4VNE4T0CqU7pWjtI9GctFWKjf86Qt8W1qWdvvaWqyqCSjLmivorjmIknYewn+P6R1jp4TRCorhpDVVA8VlSVyepFGfcxo2ONzWOw+r8pCWmAAXLaXeoVxP1b+mNZYWQUaSkbrY4tKSqtIlDmvYG0yUbAh70RNKvYmqDGKoBmqvtbHmha6mBuiCBuYYNcxLyKKpCfHwm3KPpc2pynVNqPCFC2AHQdGRkdBabeVeWhVQXMqMQyXNgyI1KaEqoKzi9H6AP52fBwXp6VxLcQPFZUj8c8NBE69VuYF2CK7Oqd0wXqDcUbfZUkYtPKtVWo1cOvqm1h4/Bu+/LioSN4T/r6ton0JnEPcZDR1ogZqGgQbuR+i3whYNfRsGIghbNHA/Qr91aCz6BzYbARjcFUOvAAAAAElFTkSuQmCC',
  },
  thumbnail: {
    uri:
      'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Ddd2aa592-80ac-4d7a-8bdc-47aeb25ce158%26format%3Dpng%26height%3D200',
  },
  barcode: {
    uri:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN6SURBVO3BS45jRwADwWRB979yuhdecFXAg6QefxgRfzDzt8NMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0x58aYk/CaVmyQ0lSeS8ITKTRJ+k8o7DjPlMFMOM+XFh6l8UhKeULlJwicloancqHxSEj7pMFMOM+UwU158WRKeUHkiCTcqTaUl4UalJaGpvCMJT6h802GmHGbKYaa8+I9LQlO5UWlJ+D85zJTDTDnMlBf/MSotCS0JTeVGpSWhJaGp/JsdZsphphxmyosvU/lNSXgiCU3lRuWTVP5JDjPlMFMOM+XFhyXhT1JpSWgqLQk3SWgqLQlN5SYJ/2SHmXKYKYeZ8uJNKv9kKi0JTeWbVP5NDjPlMFMOMyX+4A1JaCotCZ+kcpOEG5XflIRPUvmmw0w5zJTDTIk/+KAkNJWbJDSVmyQ0lZskfJNKS0JTeSIJTeU3HWbKYaYcZkr8wRcl4UblJgk3Kk8k4ZtUWhKeULlJwo3KOw4z5TBTDjPlxYcl4R1JaCotCTdJuFG5SUJTuUnCjconqXzTYaYcZsphpsQf/KIk3Ki0JDSVT0pCU2lJeEKlJeE3qbzjMFMOM+UwU+IP3pCEd6i8IwlN5U9KQlN5IglN5TcdZsphphxmyosPU3lHEm5UmkpLwjtUbpLQVG6ScKPSVG6ScKPyjsNMOcyUw0x58WVJeIfKO1RaEprKTRJukvCOJDSVG5WWhE86zJTDTDnMlBdfptKS8EQSmkpLwjeptCR8UxJuVL7pMFMOM+UwU168SeUJlW9SaUloKi0JT6i0JDSVJ5LQVG6S0FQ+6TBTDjPlMFNevCkJv0mlqbQkNJUblZaET0pCU7lJQlNpKi0JTeUdh5lymCmHmfLiw1Q+KQk3SWgqLQlNpSXhRqUl4QmVT0pCU/mkw0w5zJTDTHnxZUl4QuWTVJ5QaUl4IgnvUGlJ+E2HmXKYKYeZ8uJ/TuVGpSXhRqUloam0JLQkNJWbJDSVdxxmymGmHGbKi/+4JDyhcqNyk4SmcqPSktCS0FS+6TBTDjPlMFNefJnKN6ncqLQkNJWbJDyh8kQSmsqfdJgph5lymCkvPiwJvykJ36TyjiTcqLQk/EmHmXKYKYeZEn8w87fDTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNM+QvFao35BOHtSwAAAABJRU5ErkJggg==',
  },
  primaryFields: [
    {
      key: 'member',
      label: null,
      value: 'Conrad VanLandingham',
      textAlignment: 'LEFT',
    },
  ],
  secondaryFields: [
    {
      key: 'home',
      label: 'home',
      value: 'Richardson, TX',
      textAlignment: 'LEFT',
    },
    {
      key: 'campus',
      label: 'campus',
      value: 'Main Campus',
      textAlignment: 'RIGHT',
    },
  ],
  backgroundColor: 'salmon',
  foregroundColor: 'rgb(248, 247, 244)',
  labelColor: null,
  logoText: 'Apollos Church',
  passkitFileUrl: null,
};
storiesOf('ui-passes/PassView', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('Default', () => <PassView {...passData} />)
  .add('Loading', () => <PassView isLoading />);
