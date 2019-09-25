/**
 * Multiple post selector for Gutenberg components
 * mark@sayhello.ch since 27.8.2019
 *
 * Usage:
	<PostCheckboxes
		post_type="sht_custom_post_type"
		attributes={this.props.attributes}
		setAttributes={this.props.setAttributes}
		emptyText={ _x('No posts available', 'Post checkbox component warning', 'sha') }
	/>
 */

const { CheckboxControl } = wp.components;
const { withState } = wp.compose;
const { select, withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { _x } = wp.i18n;

class PostCheckboxes extends Component {

	constructor(props) {
		super(...arguments);
		this.props = props;
	}

	render() {

		const { attributes, checkboxes, setAttributes, emptyText } = this.props;
		const { posts } = attributes;

		let empty_text = emptyText;
		if(!empty_text){
			empty_text = _x('No posts available', 'Post checkbox component warning', 'sha');
		}

		return (
			<Fragment>
				{
					!checkboxes && empty_text &&
					<p>{ empty_text }</p>
				}
				{
					checkboxes && checkboxes.map(checkbox => {
						return (
							<CheckboxControl
								label={checkbox.label}
								checked={posts.indexOf(checkbox.value) !== -1} // checks if the checkbox key is in the posts array
								onChange={isChecked => {
									if (isChecked) {
										// add checkbox key to posts array
										setAttributes({ posts: posts.concat(checkbox.value) });
									} else {
										// remove checkbox key from posts array
										setAttributes({ posts: posts.filter(item => item !== checkbox.value) });
									}
								}}
							/>
						)
					})
				}
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {

	const { getEntityRecords } = select( 'core' );

	let posts = getEntityRecords( 'postType', props.post_type, {
		per_page: -1,
		orderby: 'title',
		order: 'asc'
	} );

	if ( !posts ) {
		return posts;
	}

	let checkboxes = [];

	posts.map( post => {
		checkboxes.push( { value: post.id, label: post.title.raw } );
	} );

	return {
		checkboxes: checkboxes
	};

} )( PostCheckboxes );
