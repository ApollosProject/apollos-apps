import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import PropTypes from 'prop-types';

import HTMLView from '.';

class MagicChangingHtml extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = { count: 1 };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(({ count }) => ({
        count: count + 1,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children(
      `<div><p>This content should not repeat </p><p>The Latest Bit of Content - ${
        this.state.count
      } </p></div>`
    );
  }
}

storiesOf('ui-htmlview/HTMLView', module)
  .add('Example', () => (
    <ScrollView>
      <SafeAreaView>
        <HTMLView>
          {
            "<p><b>I sat on my couch</b> next to my <i>high</i> school <a href='https://newspringfuse.com/groups' target='_blank'>Fuse Group</a>, silently fuming at their inability to put their phones down during Bible study. Finally, I spoke up, teasing one of the girls in a tone that clearly said, &ldquo;I&rsquo;m not actually kidding.&rdquo;&nbsp;</p>\n\n<p>A few days later, I was in the car with my sister, and as I sat in the passenger seat responding to emails, I heard her laugh and say, &ldquo;You always mumble when you are typing. Stop doing that.&rdquo;&nbsp;</p>\n\n<p>&ldquo;Sorry,&rdquo; I responded. &ldquo;I just don&rsquo;t want people to think I&rsquo;m ignoring them when I&rsquo;m typing.&rdquo;</p>\n\n<p>But the truth is, I am ignoring them! In my head, this behavior is totally acceptable. I tell myself I&rsquo;m tending to my priorities in order, and in doing so, I send a message to the person in front of me that she is of lesser importance.</p>\n\n<blockquote>\n<p>My phone is the primary outlet that distracts me from people who need my attention.</p>\n</blockquote>\n\n<p>I quickly get frustrated when I am the one on the outside, but how often to I shut others out during my own social media binges or email frenzies? Just like my girls, I&rsquo;m learning that my phone is the primary outlet that distracts me from people who need my attention.</p>\n\n<h3>Why Being Present Matters</h3>\n\n<p>There is nothing wrong with using our phones &mdash; as long as we remember that the best investment we can make is to invest in our relationships with Jesus and each other. We were created for <a href='http://newspring.cc/community' target='_blank'>community</a> by God, who exists in community as Father, Son, and Holy Spirit (John 1:1-2, Genesis 2:18).&nbsp;</p>\n\n<p>Our phones help us stay connected, but they are not the foundation of all connection. If we&rsquo;re honest, our phones are much quicker to distract and disengage us from the people right in front of us.&nbsp;</p>\n\n<p>Jesus said loving God and loving others is greatest of all God&rsquo;s commandments (Matthew 22:38-40). And, after trying everything the world had to offer, King Solomon reminded his people that their relationships with God and others are the only things that really matter (Ecclesiastes 2:24-26, Ecclesiastes 3:9).&nbsp;</p>\n\n<blockquote>\n<p>Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones.</p>\n</blockquote>\n\n<p>So the next time we feel like we have to text back immediately or tweet before someone else does, consider:&nbsp;</p>\n\n<ul>\n\t<li>Am I putting others before myself right now?</li>\n\t<li>How can I love the people around me if I&rsquo;m not even paying attention to them?</li>\n\t<li>What if Jesus wants to speak through me, but I&rsquo;ve got my nose stuck in my phone?&nbsp;</li>\n</ul>\n\n<p>The world won&rsquo;t implode if we don&rsquo;t reply to every text or email immediately. And that Instagram picture doesn&rsquo;t need to go up ASAP. If it&rsquo;s already been a week between posts, what&rsquo;s a few more hours? We love everyone better &mdash; our friends to our coworkers to our social media followers &mdash; when we give them the gift of our full attention.&nbsp;</p>\n\n<p>I can almost hear Jesus saying, &ldquo;Greater love has no one than this: to lay down one&rsquo;s phone for one&rsquo;s loved ones&rdquo;&nbsp; (John 15:13).&nbsp;</p>\n\n<h3>Four Ways To Stay Away From Your Phone And Be Intentionally Present</h3>\n\n<p><a href='http://newspring.cc/christmas' target='_blank'>This holiday season</a>, we will have more opportunities to be around friends and family than usual. So let&rsquo;s make the most of each minute. The following are some tips can help us all be a little more present.&nbsp;&nbsp;</p>\n\n<ol>\n\t<li>Turn your phone off, leave it in the car, or put it in airplane mode. Habitual notification checks can take a break.</li>\n\t<li>Talk about something other than yourself. Ask someone else about their life (job, school, kids).</li>\n\t<li>Look for opportunities to encourage someone. Ask the Holy Spirit to speak through you and help you love people.</li>\n\t<li>Ask Jesus to keep your heart interested and engaged in what really matters. He wants to help!</li>\n</ol>\n\n<p>Intentionally taking advantage of time with loved ones sometimes does require sacrificing our own immediate desires or comforts, but that&rsquo;s what we are commanded to do (Philippians 2:3).&nbsp;</p>\n\n<p>Take pictures, but don&rsquo;t let the only memory be a digital one. The positive outcome of interactions should be more than Instagram likes. Unplug from social media, choose to be present, and you will be surprised at the good it does for your heart and the hearts of those around you.&nbsp;</p>"
          }
        </HTMLView>
      </SafeAreaView>
    </ScrollView>
  ))
  .add('ul / ol', () => (
    <ScrollView>
      <SafeAreaView>
        <HTMLView>
          {
            '<p><h1>Ordered List</h1><ol>\n\t<li>Turn your phone off, leave it in the car, or put it in airplane mode. Habitual notification checks can take a break.</li>\n\t<li>Talk about something other than yourself. Ask someone else about their life (job, school, kids).</li>\n\t<li>Look for opportunities to encourage someone. Ask the Holy Spirit to speak through you and help you love people.</li>\n\t<li>Ask Jesus to keep your heart interested and engaged in what really matters. He wants to help!</li>\n</ol></p><p><ul>\n\t<h1>Unordered List</h1><li>Turn your phone off, leave it in the car, or put it in airplane mode. Habitual notification checks can take a break.</li>\n\t<li>Talk about something other than yourself. Ask someone else about their life (job, school, kids).</li>\n\t<li>Look for opportunities to encourage someone. Ask the Holy Spirit to speak through you and help you love people.</li>\n\t<li>Ask Jesus to keep your heart interested and engaged in what really matters. He wants to help!</li>\n</ul></p>'
          }
        </HTMLView>
      </SafeAreaView>
    </ScrollView>
  ))
  .add('bad html text', () => (
    <ScrollView>
      <SafeAreaView>
        <HTMLView>
          {`
            <p>Ever wish your home life felt as good as it looks on Instagram? If so, you’re not alone.</p><p>We can’t control the culture outside our homes, but we can shape the culture in and through our home. So on Sunday, Oct. 20, we’re starting a new series, “Win at Home,” where we’ll learn practical ways that you and your house can serve the Lord.</p><p>While we’re learning to win at home, kids are starting a new series in <a href="http://newspring.cc/kidspring" target="_blank" style="background-color: rgb(255, 255, 255);">KidSpring</a> called “Mystery Manor.” At Mystery Manor, kids will learn that all the answers to their questions about God, Jesus, and heaven are in the Bible! This series starts Sunday, Oct. 13 with the goal of growing kids’ faith and teaching them to search for God in His Word.</p><h4>Connect Classes</h4><div><a href="https://newspring.cc/connect" target="_blank" style="background-color: rgb(255, 255, 255);">Connect Classes</a> focus on God's promises from <a href="https://www.bible.com/bible/59/EXO.6.6-8.ESV"  target="_blank" class="scripture" title="YouVersion">Exodus 6:6-8</a>. At the end of each four classes, you’ll not only feel more connected — you’ll gain a deeper understanding of who God is, what He wants for you, and what it means to be part of His family.<br></div><div><br></div><ul><li>Sunday, Oct. 6 - Connect to Salvation</li><li>Sunday, Oct. 13 - Connect to Freedom</li><li>Sunday, Oct. 20 - Connect to Purpose</li><li>Sunday, Oct. 27 - Connect to Family</li></ul><div>Connect Classes happen at 9:15am and 11:15am on every campus. Sign up <a href="https://newspring.cc/Workflows/431" target="_blank">here</a>. If you’ve got kids, you’ll simply check them in for two services when you go to <a href="http://newspring.cc/kidspring" target="_blank">KidSpring</a>.</div><div><br></div><div>Already been to Connect Classes? Check out all the events happening at your campus this month.</div><div><br></div><h4>Anderson Campus</h4><div>Tuesday, Oct. 1<br></div><div>7pm</div><div><a href="https://newspring.cc/news/lets-rally-with-passion-in-october" target="_blank">Rally</a> - Passion is coming to Rally’s regional gathering in October. If you’re between 18 and 25, don’t miss this special night of worship!&nbsp;</div><div><br></div><div>Saturday, Oct. 5&nbsp;</div><div>7:30am&nbsp;</div><div>Men's Breakfast - Guys of all ages are invited to breakfast in the <a href="https://newspring.cc/anderson" target="_blank">East Auditorium</a>. We’ll share some good food and pray together, so we start the weekend and the month encouraged.</div><div><br></div><div>Thursday, Oct. 24</div><div>6-9pm</div><div>NewSpring Recovery -  <a href="https://www.facebook.com/profile.php?id=2291832627543064&amp;ref=br_rs" target="_blank">NewSpring Recovery</a> meets the last Thursday of every month in the East Auditorium. We focus on equipping and supporting anyone negatively affected by drugs and alcohol.</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><h4>Columbia Campus&nbsp;</h4><div>Tuesday, Oct.&nbsp;<br></div><div>7pm</div><div><a href="https://newspring.cc/news/lets-rally-with-passion-in-october" target="_blank">Rally</a> - Passion is coming to Rally’s regional gathering in October. If you’re between 18 and 25, don’t miss this special night of worship!&nbsp;</div><div><br></div><div>Thursday, Oct. 3</div><div>6:30pm&nbsp;</div><div>Rally Bible Study - If you’re between 18 and 25, come study the Bible and share a meal with other young adults in Columbia. Rally Director Kurt Frisbee will host this study through the book of John every other Thursday.&nbsp;</div><div><br></div><div>Saturday, Oct. 5</div><div>9am&nbsp;</div><div>Campus Clean-Up Day - Everyone is invited to clean up the outside of the <a href="https://newspring.cc/locations/columbia" target="_blank">Columbia Campus</a>, including landscaping. Serving together is a great way to connect to others in our church family.&nbsp;</div><div><br></div><div>Tuesday, Oct. 8&nbsp;</div><div>7pm</div><div>Women's Gathering - Ladies, come connect to Jesus and each other. Women 18 and older are invited to this monthly night of worship, teaching, and small groups. Coffee and dessert will be served. To sign up or get more info, email columbia@newspring.cc&nbsp;</div><div><br></div><div>Thursday, Oct. 17&nbsp;</div><div>6:30pm&nbsp;</div><div>Rally Bible Study - If you’re between 18 and 25, come study the Bible and share a meal with other young adults in Columbia. Rally Director Kurt Frisbee will host this study through the book of John every other Thursday.&nbsp;</div><div><br></div><div>Thursday, Oct. 24&nbsp;</div><div>6:45am</div><div>Men's Gathering - Men, join us once a month as we gather around God’s Word and enjoy some intentional community. For more info, email chris.allen@newspring.cc&nbsp;</div><div><br></div><h4>Greenville Campus</h4><div>Sunday, Oct. 6&nbsp;<br></div><div>9:15 and 11:15am&nbsp;</div><div><a href="https://newspring.cc/news/newspring-greenville-is-changing-locations-sept-29-and-oct-6" target="_blank">Sunday Gatherings</a> - A scheduling conflict means we won’t gather at the Greenville Convention Center. Instead, let’s get to know our no ordinary family around the state! Join us at <a href="https://newspring.cc/locations" target="_blank">another Upstate campus</a> this week.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><div><br></div><div>Monday, Oct. 14&nbsp;</div><div>7pm&nbsp;</div><div>Women's Gathering - Ladies of all ages are invited to the <a href="https://newspring.cc/eastlan" target="_blank">Eastlan Campus</a> as we engage with God's Word and make meaningful connections with one another.</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</div><div>Sunday, Oct. 27&nbsp;</div><div>10:30am&nbsp;</div><div>Rally Breakfast - Meet other 18- to 25-year-olds at the <a href="https://newspring.cc/locations/greenville" target="_blank">Greenville Campus</a>. Join us for breakfast between services.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><div><br></div><div>Monday, Oct. 28</div><div>7pm</div><div>Men's Gathering - Men of every age are invited to the <a href="https://newspring.cc/eastlan" target="_blank">Eastlan Campus</a> as we look into the Bible and connect with other guys.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><div><br></div><h4>Greenwood Campus</h4><div>Every Friday starting Sept. 6<br></div><div>6am&nbsp;</div><div>Men's Gathering - This is an opportunity for guys to get together before work, open up God's Word and learn from one another. Meet at the <a href="https://newspring.cc/locations/greenwood" target="_blank">Greenwood Campus</a>.&nbsp;</div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div><div><br></div><div><br></div><p></p>
            `}
        </HTMLView>
      </SafeAreaView>
    </ScrollView>
  ))
  .add('Example Links', () => (
    <ScrollView>
      <SafeAreaView>
        <HTMLView>
          {`
            <p>A normal HTTP <a href="http://example.com">link</a></p>
            <p>A content deep <a href="apolloschurchapp://navigate/ContentSingle?itemId=?WeekendContentItem:cdfcef9941c7140b303251714b9b7ecd">link</a></p>
            <p>How about a <a href="mailto:vincent@differential.com">mailto? </a></p>
            `}
        </HTMLView>
      </SafeAreaView>
    </ScrollView>
  ))
  .add('isLoading', () => (
    <ScrollView>
      <HTMLView isLoading />
    </ScrollView>
  ))
  .add('Changing Content', () => (
    <ScrollView>
      <MagicChangingHtml>
        {(content) => <HTMLView>{content}</HTMLView>}
      </MagicChangingHtml>
    </ScrollView>
  ));
