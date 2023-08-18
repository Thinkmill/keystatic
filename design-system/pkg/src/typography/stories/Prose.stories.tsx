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

<h2>Code</h2>
<h3>Code block</h3>
<pre>
<code>var foo = function (bar) {
  return bar++;
};

console.log(foo(5));</code>
</pre>
<h3>Inline code</h3>
<p>We export a config object wrapped in the <code>config</code> function imported from <code>@keystatic/core</code>.</p>

<h2>Links</h2>
<p>A paragraph that contains <a href="http://dev.nodeca.com">link text</a> within it.</p>

<h2>Images</h2>
<p><img src="https://octodex.github.com/images/original.png" alt="Octocat" title="The Octocat"></p>

<h2>TODO: "not-prose"</h2>
<div class="not-prose">
<h3>Heading 3</h3>
<p>Some paragraph text</p>
<ul>
<li>list</li>
<li>of</li>
<li>things</li>
</ul>
</div>`;
