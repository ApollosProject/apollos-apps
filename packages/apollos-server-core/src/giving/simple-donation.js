// import ApollosConfig from '@apollosproject/config';

// NEEDS TO BE UPDATED TO USE dataSources.Config
export default function useSimpleDonationRoute({ app }) {
  // Give Screen
  // app.get('/simpledonation', (req, res) => {
  //   res.send(`
  //           <!DOCTYPE html>
  //           <html>
  //               <head>
  //                   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //               </head>
  //               <body>
  //                   <script async src="https://merlin.simpledonation.com/js/installScript.js?cssFile=${
  //                     req?.protocol
  //                   }://${req?.get('host')}/giving.css"></script>
  //                   <a href="#" class="open-merlin" style="color:white;" data-merlin-key="${
  //                     ApollosConfig?.SIMPLEDONATION?.KEY
  //                   }" data-merlin-autoload="true">Give Now</a>
  //               </body>
  //           </html>
  //           `);
  // });
  // app.get('/giving.css', (req, res) => {
  //   res.sendFile(`${__dirname}/giving.css`);
  // });
}
