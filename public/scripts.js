const Mask = {
    apply(input, func) {
        setTimeout(function() {
            //  pegar o value do input e rodar a function passando o value para a function
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {    
        value = value.replace(/\D/g, "")
    
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    },

    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 14) {
            value = value.slice(0, -1)
        }

        // Check if cnpj - 11.222.333/0001-11
        if (value.length > 11) {

            //11.222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2" )

            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            // 11.222.333/444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")

             // 11.222.333/4444-55
            value = value.replace(/(\d{4})(\d)/, "$1-$2")

        } else {
            // cpf 111.222.333.44
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },

    cep(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 8) {
            value = value.slice(0, -1)
        }

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    } 
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        // Vai colocar a imagem no array
        Array.from(fileList).forEach((file) => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        // Trocando o comportamento padrao para o nosso
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    hasLimit(event) {
        // Vai pegar o total de arquivos e verificar o limite
        const { uploadLimit, input, preview} = PhotosUpload
        const { files: fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Voce enviou ${fileList.length}. Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        // preview é o container e childNodes é os filhos
        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("Limite max")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        // Adicionando cada item no dataTransfer ou atualizando
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        // Vai pegar e adicionar uma div e class
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'

        return button
    },

    removePhoto(event) {
        // Quando clicar na foto
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        // aplica no array pra tirar uma posiçao do array
        PhotosUpload.files.splice(index, 1)
        // Roda a função de novo
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')
        
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        // Não sai do campo enquanto não por email certo
        if (results.error) {
            Validate.displayError(input, results.error)
        }

    },

    // Create display 
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')

        if (errorDiv)
            errorDiv.remove()
    },

    isEmail(value) {
        let error = null

        // ab. ou ab-abc@abc.abc
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"
        return {
            error,
            value
        }
    },

    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if(cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto!"
        } 
        else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = "CPF incorreto!"
        }

        return {
            error,
            value
        }
    },

    isCep(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if(cleanValues.length !== 8) {
            error = "CEP inválido!"
        } 

        return {
            error,
            value
        }
    }
}