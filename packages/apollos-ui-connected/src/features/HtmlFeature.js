import HTMLView from '@apollosproject/ui-htmlview';
import { PaddedView } from '@apollosproject/ui-kit';

const HtmlFeature = ({ content }) => (
  <PaddedView>
    <HTMLView children={content} />
  </PaddedView>
);

export default HtmlFeature;
