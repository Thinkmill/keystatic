import { Prose } from '../Prose';

export default {
  title: 'Components/Typography/Prose',
};

export const Default = () => (
  <Prose dangerouslySetInnerHTML={{ __html: htmlElements }} />
);

Default.story = {
  name: 'default',
};

const htmlElements = `<h1>h1 Heading</h1>
<h2>h2 Heading</h2>
<h3>h3 Heading</h3>
<h4>h4 Heading</h4>
<h5>h5 Heading</h5>
<h6>h6 Heading</h6>
<h2>Horizontal Rules</h2>
<hr>

<h2>Typographic replacements</h2>
<p>Enable typographer option to see result.</p>
<p>© © ® ® ™ ™ (p) (P) ±</p>
<p>test… test… test… test?.. test!..</p>
<p>!!! ??? ,  – —</p>
<p>“Smartypants, double quotes” and ‘single quotes’</p>
<h2>Emphasis</h2>
<p><strong>This is bold text</strong></p>
<p><em>This is italic text</em></p>
<p><s>Strikethrough</s></p>

<h2>Blockquotes</h2>
<blockquote>
<p>Blockquotes can also be nested…</p>
<blockquote>
<p>…by using additional greater-than signs right next to each other…</p>
<blockquote>
<p>…or with spaces between arrows.</p>
</blockquote>
</blockquote>
</blockquote>
<h2>Lists</h2>
<p>Unordered</p>
<ul>
<li>Create a list by starting a line with <code>+</code>, <code>-</code>, or <code>*</code></li>
<li>Sub-lists are made by indenting 2 spaces:
<ul>
<li>Marker character change forces new list start:
<ul>
<li>Ac tristique libero volutpat at</li>
</ul>
<ul>
<li>Facilisis in pretium nisl aliquet</li>
</ul>
<ul>
<li>Nulla volutpat aliquam velit</li>
</ul>
</li>
</ul>
</li>
<li>Very easy!</li>
</ul>
<p>Ordered</p>
<ol>
<li>Lorem ipsum dolor sit amet</li>
<li>Consectetur adipiscing elit</li>
<li>
Integer molestie lorem at massa
<ol>
<li>Lorem ipsum dolor sit amet</li>
<li>Consectetur adipiscing elit</li>
<li>
Integer molestie lorem at massa
<ol>
<li>Lorem ipsum dolor sit amet</li>
<li>Consectetur adipiscing elit</li>
<li>Integer molestie lorem at massa</li>
<li>You can use sequential numbers…</li>
</ol>
</li>
<li>You can use sequential numbers…</li>
</ol>
</li>
<li>You can use sequential numbers…</li>
</ol>
<p>Start numbering with offset:</p>
<ol start="57">
<li>foo</li>
<li>bar</li>
</ol>
<h2>Links</h2>
<p><a href="http://dev.nodeca.com">link text</a></p>
<p><a href="http://nodeca.github.io/pica/demo/" title="title text!">link with title</a></p>
<h2>Images</h2>
<p><img src="https://octodex.github.com/images/minion.png" alt="Minion">
<img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat"></p>
<p>Like links, Images also have a footnote style syntax</p>
<p><img src="https://octodex.github.com/images/dojocat.jpg" alt="Alt text" title="The Dojocat"></p>
<p>With a reference later in the document defining the URL location:</p>`;
