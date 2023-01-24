import React from 'react'


class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);

        this.textInput = null;

        this.setTextInputRef = element => {
            this.textInput = element;
        };

        this.focusTextInput = () => {
            // Donne le focus au champ texte en utilisant l’API DOM native.
            if (this.textInput) this.textInput.focus();
        };
    }

    componentDidMount() {
        // Focus automatique sur le champ au montage
        this.focusTextInput();
    }

    render() {
        // Utilise la fonction de rappel `ref` pour stocker une référence à l’élément
        // DOM du champ texte dans une propriété d’instance (ex. this.textInput)
        return (
            <div>
                <input
                    type="text"
                    ref={this.setTextInputRef}
                />
                <input
                    type="button"
                    value="Donner le focus au champ texte"
                    onClick={this.focusTextInput}
                />
            </div>
        );
    }
}

export default CustomTextInput