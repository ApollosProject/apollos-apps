import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';

import HTMLView from '.';

describe('the HTMLView component', () => {
  it('should render an H1', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h1>Testings</h1>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an H2', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h2>Testings</h2>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an H3', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h3>Testings</h3>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an H4', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h4>Testings</h4>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an H5', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h5>Testings</h5>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an H6', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<h6>Testings</h6>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a paragraph', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p>Testings</p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render italic text', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p><em>Testings</em></p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render italic text using <i>', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p><i>Testings</i></p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render bold text', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p><strong>Testings</strong></p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render bold text using <b>', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p><b>Testings</b></p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a block quote', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {'<p>Testings</p><blockquote>Testings</blockquote>'}
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a list', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<ul><li>Testings</li><li>Testings</li></ul>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render an ordered list', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<ol><li>Testings</li><li>Testings</li></ol>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a link', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {'<p>Testings <a href="http://wwww.google.com">Google</a></p>'}
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render handle relative links', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {'<p>Testings <a href="//google.com">Google</a></p>'}
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('strips keeps badly formatted links', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{"<p><a href='{page_536525}'>Bad link</a></p>"}</HTMLView>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render an image', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {'<img src="https://placeholdit.co/i/150x150?bg=eeeeee&fc=577084" />'}
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should not render local images', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {`
            <p>You shouldn't see an image below <img src="/images/fake-image.png"></img></p>
            `}
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should not render an image inside an anchor', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {
            '<a href="http://wwww.google.com"><img src="https://placeholdit.co/i/150x150?bg=eeeeee&fc=577084" /></a>'
          }
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a div as a View', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<div>Boom</div>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a line break (br)', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p>Testings</p><br>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render spaces between spans', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {
            '<p><span>There are some bits of scripture</span> <span>where the spaces between words</span> <span>exist outside spans</span></p>'
          }
        </HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a line break (br) without a parent', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<p>Testings</p><br><p>Testings 2</p>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should handle wierdly formatted nested line breaks in divs used to create poorly formatted html block spacing created by WYSIWYG editors', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<div><br /></div>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should handle wierdly formatted nested line breaks in divs used to create poorly formatted html inline spacing created by WYSIWYG editors', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>{'<span><br /></span>'}</HTMLView>
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView isLoading />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render example HTML', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {
            "<p>I sat on my couch next to my high school <a href='https://newspringfuse.com/groups' target='_blank'>Fuse Group</a>, silently fuming at their inability to put their phones down during Bible study. Finally, I spoke up, teasing one of the girls in a tone that clearly said, &ldquo;I&rsquo;m not actually kidding.&rdquo;&nbsp;</p>\n\n<p>A few days later, I was in the car with my sister, and as I sat in the passenger seat responding to emails, I heard her laugh and say, &ldquo;You always mumble when you are typing. Stop doing that.&rdquo;&nbsp;</p>\n\n<p>&ldquo;Sorry,&rdquo; I responded. &ldquo;I just don&rsquo;t want people to think I&rsquo;m ignoring them when I&rsquo;m typing.&rdquo;</p>\n\n<p>But the truth is, I am ignoring them! In my head, this behavior is totally acceptable. I tell myself I&rsquo;m tending to my priorities in order, and in doing so, I send a message to the person in front of me that she is of lesser importance.</p>\n\n<blockquote>\n<p>My phone is the primary outlet that distracts me from people who need my attention.</p>\n</blockquote>\n\n<p>I quickly get frustrated when I am the one on the outside, but how often to I shut others out during my own social media binges or email frenzies? Just like my girls, I&rsquo;m learning that my phone is the primary outlet that distracts me from people who need my attention.</p>\n\n<h3>Why Being Present Matters</h3>\n\n<p>There is nothing wrong with using our phones &mdash; as long as we remember that the best investment we can make is to invest in our relationships with Jesus and each other. We were created for <a href='http://newspring.cc/community' target='_blank'>community</a> by God, who exists in community as Father, Son, and Holy Spirit (John 1:1-2, Genesis 2:18).&nbsp;</p>\n\n<p>Our phones help us stay connected, but they are not the foundation of all connection. If we&rsquo;re honest, our phones are much quicker to distract and disengage us from the people right in front of us.&nbsp;</p>\n\n<p>Jesus said loving God and loving others is greatest of all God&rsquo;s commandments (Matthew 22:38-40). And, after trying everything the world had to offer, King Solomon reminded his people that their relationships with God and others are the only things that really matter (Ecclesiastes 2:24-26, Ecclesiastes 3:9).&nbsp;</p>\n\n<blockquote>\n<p>Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones.</p>\n</blockquote>\n\n<p>So the next time we feel like we have to text back immediately or tweet before someone else does, consider:&nbsp;</p>\n\n<ul>\n\t<li>Am I putting others before myself right now?</li>\n\t<li>How can I love the people around me if I&rsquo;m not even paying attention to them?</li>\n\t<li>What if Jesus wants to speak through me, but I&rsquo;ve got my nose stuck in my phone?&nbsp;</li>\n</ul>\n\n<p>The world won&rsquo;t implode if we don&rsquo;t reply to every text or email immediately. And that Instagram picture doesn&rsquo;t need to go up ASAP. If it&rsquo;s already been a week between posts, what&rsquo;s a few more hours? We love everyone better &mdash; our friends to our coworkers to our social media followers &mdash; when we give them the gift of our full attention.&nbsp;</p>\n\n<p>I can almost hear Jesus saying, &ldquo;Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones&rdquo;&nbsp; (John 15:13).&nbsp;</p>\n\n<h3>Four Ways To Stay Away From Your Phone And Be Intentionally Present</h3>\n\n<p><a href='http://newspring.cc/christmas' target='_blank'>This holiday season</a>, we will have more opportunities to be around friends and family than usual. So let&rsquo;s make the most of each minute. The following are some tips can help us all be a little more present.&nbsp;&nbsp;</p>\n\n<ol>\n\t<li>Turn your phone off, leave it in the car, or put it in airplane mode. Habitual notification checks can take a break.</li>\n\t<li>Talk about something other than yourself. Ask someone else about their life (job, school, kids).</li>\n\t<li>Look for opportunities to encourage someone. Ask the Holy Spirit to speak through you and help you love people.</li>\n\t<li>Ask Jesus to keep your heart interested and engaged in what really matters. He wants to help!</li>\n</ol>\n\n<p>Intentionally taking advantage of time with loved ones sometimes does require sacrificing our own immediate desires or comforts, but that&rsquo;s what we are commanded to do (Philippians 2:3).&nbsp;</p>\n\n<p>Take pictures, but don&rsquo;t let the only memory be a digital one. The positive outcome of interactions should be more than Instagram likes. Unplug from social media, choose to be present, and you will be surprised at the good it does for your heart and the hearts of those around you.</p>"
          }
        </HTMLView>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should handle the HTML changing', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLView>
          {
            "<p>I sat on my couch next to my high school <a href='https://newspringfuse.com/groups' target='_blank'>Fuse Group</a>, silently fuming at their inability to put their phones down during Bible study. Finally, I spoke up, teasing one of the girls in a tone that clearly said, &ldquo;I&rsquo;m not actually kidding.&rdquo;&nbsp;</p>\n\n<p>A few days later, I was in the car with my sister, and as I sat in the passenger seat responding to emails, I heard her laugh and say, &ldquo;You always mumble when you are typing. Stop doing that.&rdquo;&nbsp;</p>\n\n<p>&ldquo;Sorry,&rdquo; I responded. &ldquo;I just don&rsquo;t want people to think I&rsquo;m ignoring them when I&rsquo;m typing.&rdquo;</p>\n\n<p>But the truth is, I am ignoring them! In my head, this behavior is totally acceptable. I tell myself I&rsquo;m tending to my priorities in order, and in doing so, I send a message to the person in front of me that she is of lesser importance.</p>\n\n<blockquote>\n<p>My phone is the primary outlet that distracts me from people who need my attention.</p>\n</blockquote>\n\n<p>I quickly get frustrated when I am the one on the outside, but how often to I shut others out during my own social media binges or email frenzies? Just like my girls, I&rsquo;m learning that my phone is the primary outlet that distracts me from people who need my attention.</p>\n\n<h3>Why Being Present Matters</h3>\n\n<p>There is nothing wrong with using our phones &mdash; as long as we remember that the best investment we can make is to invest in our relationships with Jesus and each other. We were created for <a href='http://newspring.cc/community' target='_blank'>community</a> by God, who exists in community as Father, Son, and Holy Spirit (John 1:1-2, Genesis 2:18).&nbsp;</p>\n\n<p>Our phones help us stay connected, but they are not the foundation of all connection. If we&rsquo;re honest, our phones are much quicker to distract and disengage us from the people right in front of us.&nbsp;</p>\n\n<p>Jesus said loving God and loving others is greatest of all God&rsquo;s commandments (Matthew 22:38-40). And, after trying everything the world had to offer, King Solomon reminded his people that their relationships with God and others are the only things that really matter (Ecclesiastes 2:24-26, Ecclesiastes 3:9).&nbsp;</p>\n\n<blockquote>\n<p>Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones.</p>\n</blockquote>\n\n<p>So the next time we feel like we have to text back immediately or tweet before someone else does, consider:&nbsp;</p>\n\n<ul>\n\t<li>Am I putting others before myself right now?</li>\n\t<li>How can I love the people around me if I&rsquo;m not even paying attention to them?</li>\n\t<li>What if Jesus wants to speak through me, but I&rsquo;ve got my nose stuck in my phone?&nbsp;</li>\n</ul>\n\n<p>The world won&rsquo;t implode if we don&rsquo;t reply to every text or email immediately. And that Instagram picture doesn&rsquo;t need to go up ASAP. If it&rsquo;s already been a week between posts, what&rsquo;s a few more hours? We love everyone better &mdash; our friends to our coworkers to our social media followers &mdash; when we give them the gift of our full attention.&nbsp;</p>\n\n<p>I can almost hear Jesus saying, &ldquo;Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones&rdquo;&nbsp; (John 15:13).&nbsp;</p>\n\n<h3>Four Ways To Stay Away From Your Phone And Be Intentionally Present</h3>\n\n<p><a href='http://newspring.cc/christmas' target='_blank'>This holiday season</a>, we will have more opportunities to be around friends and family than usual. So let&rsquo;s make the most of each minute. The following are some tips can help us all be a little more present.&nbsp;&nbsp;</p>\n\n<ol>\n\t<li>Turn your phone off, leave it in the car, or put it in airplane mode. Habitual notification checks can take a break.</li>\n\t<li>Talk about something other than yourself. Ask someone else about their life (job, school, kids).</li>\n\t<li>Look for opportunities to encourage someone. Ask the Holy Spirit to speak through you and help you love people.</li>\n\t<li>Ask Jesus to keep your heart interested and engaged in what really matters. He wants to help!</li>\n</ol>\n\n<p>Intentionally taking advantage of time with loved ones sometimes does require sacrificing our own immediate desires or comforts, but that&rsquo;s what we are commanded to do (Philippians 2:3).&nbsp;</p>\n\n<p>Take pictures, but don&rsquo;t let the only memory be a digital one. The positive outcome of interactions should be more than Instagram likes. Unplug from social media, choose to be present, and you will be surprised at the good it does for your heart and the hearts of those around you.</p>"
          }
        </HTMLView>
      </Providers>
    );
    expect(tree).toMatchSnapshot('initial');
    tree.update(
      <Providers>
        <HTMLView>
          {'<p>There should be no duplicate content, ever!</p>'}
        </HTMLView>
      </Providers>
    );
    expect(tree).toMatchSnapshot('post update');
  });
  it('should accept an alternative render', () => {
    const testRenderer = jest.fn();
    renderer.create(
      <Providers>
        <HTMLView renderer={testRenderer}>{'<p>Testings</p>'}</HTMLView>
      </Providers>
    );

    expect(testRenderer).toBeCalled();
  });
});
